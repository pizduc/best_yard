import express from "express";
import { Pool } from "pg";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js"; 
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Pool(config.db);

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true, 
});

app.use(cors({
  origin: ["https://region42.onrender.com", "http://localhost:8080"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

db.connect((err) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err);
    process.exit(1);
  }
  console.log("✅ Подключено к PostgreSQL");
});

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

app.get("/api/projects", async (req, res) => {
  try {
    const projectResult = await db.query("SELECT * FROM projects ORDER BY year DESC");

    const projects = projectResult.rows;

    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const imagesResult = await db.query(
          "SELECT image_url FROM project_images WHERE project_id = $1",
          [project.id]
        );

        return {
          ...project,
          image: imagesResult.rows[0]?.image_url || '', 
          images: imagesResult.rows.map((img) => img.image_url), 
        };
      })
    );

    res.json(projectsWithImages);
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    res.status(500).json({ error: "Ошибка сервера при получении проектов" });
  }
});

app.post("/api/projects/add", upload.array("images"), async (req, res) => {
  try {
    const { title, address, description, year, link } = req.body;
    const images = req.files;

    const result = await db.query(
      "INSERT INTO projects (title, address, description, year, link) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, address, description, parseInt(year), link]
    );

    const projectId = result.rows[0].id;

    for (const file of images) {
      const fileName = `${uuidv4()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", 
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      const imageUrl = uploadResult.Location; 

      await db.query(
        "INSERT INTO project_images (project_id, image_url) VALUES ($1, $2)",
        [projectId, imageUrl]
      );
    }

    res.status(200).json({ message: "Проект добавлен успешно" });
  } catch (error) {
    console.error("Ошибка при добавлении проекта:", error);
    res.status(500).json({ error: "Ошибка сервера при добавлении проекта" });
  }
});

app.get("/api/projects/winners", async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*, vote_counts.vote_count FROM projects p
      JOIN (
        SELECT p2.year, p2.id, COUNT(v.id) AS vote_count
        FROM projects p2
        JOIN votes v ON p2.id = v.project_id
        GROUP BY p2.year, p2.id
      ) AS vote_counts
      ON p.id = vote_counts.id
      WHERE (p.year, vote_counts.vote_count) IN (
        SELECT year, MAX(vote_count) FROM (
          SELECT p2.year, p2.id, COUNT(v.id) AS vote_count
          FROM projects p2
          JOIN votes v ON p2.id = v.project_id
          GROUP BY p2.year, p2.id
        ) AS yearly_votes
        GROUP BY year
      );
    `);

    res.json(rows);
  } catch (err) {
    console.error("Ошибка при получении победителей:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/api/votes/count/:projectId", async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: "projectId обязателен" });
  }

  try {
    const { rows } = await db.query(
      `SELECT COUNT(*) AS vote_count FROM votes WHERE project_id = $1`,
      [projectId]
    );

    res.json({ projectId, voteCount: parseInt(rows[0].vote_count, 10) });
  } catch (err) {
    console.error("Ошибка при подсчёте голосов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/applications", (req, res) => {
  const { name, email, number, address, description } = req.body;

  if (!name || !email || !number || !address || !description) {
    return res.status(400).json({ error: "Все поля должны быть заполнены!" });
  }

  const checkSql = `SELECT * FROM applications WHERE email = $1`;
  db.query(checkSql, [email], (checkErr, result) => {
    if (checkErr) {
      console.error("❌ Ошибка при проверке email в БД:", checkErr);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ error: "На эту почту уже была подана заявка." });
    }

    const insertSql = `
      INSERT INTO applications (name, email, number, address, description)
      VALUES ($1, $2, $3, $4, $5)
    `;

    db.query(insertSql, [name, email, number, address, description], (err) => {
      if (err) {
        console.error("❌ Ошибка записи в БД:", err);
        return res.status(500).json({ error: "Ошибка сервера" });
      }

      res.json({ message: "Заявка принята!" });

      const mailOptions = {
        from: config.smtp.user,
        to: email,
        subject: "Подтверждение заявки",
        text: `Здравствуйте, ${name}!\n\nВаша заявка принята.\n\nДетали:\n- Адрес: ${address}\n- Телефон: ${number}\n- Описание: ${description}\n\nМы свяжемся с вами.\n\nС уважением, команда.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Ошибка отправки письма:", error);
        } else {
          console.log("📩 Письмо отправлено:", info.response);
        }
      });
    });
  });
});

app.get("/api/suggest", async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ error: "Необходимо указать параметры query и type" });
  }

  try {
    const response = await axios.get("https://suggest-maps.yandex.ru/v1/suggest", {
      params: {
        apikey: config.apis.yandexApiKey,
        text: query,
        lang: "ru_RU",
        types: type,
      },
    });

    const suggestions = response.data.results.map(item => item.title.text);
    res.json({ suggestions });
  } catch (error) {
    console.error("❌ Ошибка Яндекс API:", error.message);
    res.status(500).json({ error: "Ошибка при запросе к Яндекс API" });
  }
});

app.get("/api/suggest-fio", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Необходимо указать параметр query" });
  }

  try {
    const response = await axios.post(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",
      { query },
      {
        headers: {
          Authorization: `Token ${config.apis.dadataApiKey}`,
        },
      }
    );

    const suggestions = Array.isArray(response.data.suggestions) ? response.data.suggestions : [];
    res.json({ suggestions });
  } catch (error) {
    console.error("❌ Ошибка Dadata API:", error.message);
    res.status(500).json({ error: "Ошибка при запросе к Dadata API" });
  }
});

app.post("/api/login", async (req, res) => {
  const { loginType, city, street, house, apartment, contract, accountNumber } = req.body;

  console.log("Запрос на логин:", req.body);

  let query = "";
  let values = [];

  try {
    if (loginType === "address") {
      // Проверка обязательных полей
      if (!city || !street || !house || !apartment || !contract) {
        return res.status(400).json({
          success: false,
          error: "Пожалуйста, заполните все поля для входа по адресу.",
          code: "missing_fields",
        });
      }

      query = `
        SELECT user_id, is_special_user FROM users
        WHERE city = $1 AND street = $2 AND house = $3 AND apartment = $4 AND contract_number = $5
      `;
      values = [city, street, house, apartment, contract];

    } else if (loginType === "account") {
      if (!accountNumber) {
        return res.status(400).json({
          success: false,
          error: "Укажите номер лицевого счёта.",
          code: "missing_account_number",
        });
      }

      query = `
        SELECT user_id, is_special_user FROM users
        WHERE account_number = $1
      `;
      values = [accountNumber];

    } else {
      return res.status(400).json({
        success: false,
        error: "Некорректный тип входа.",
        code: "invalid_login_type",
      });
    }

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.json({
        success: true,
        userId: user.user_id,
        isSpecialUser: Boolean(user.is_special_user),
      });
    } else {
      return res.status(401).json({
        success: false,
        error: "Пользователь не найден. Проверьте введённые данные.",
        code: "user_not_found",
      });
    }

  } catch (err) {
    console.error("Ошибка при логине:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера при входе.",
      code: "server_error",
      details: err.message,
    });
  }
});

app.post("/api/email/verify-and-vote", async (req, res) => {
  const { userId, code, projectId } = req.body;

  if (!userId || !code || !projectId) {
    return res.status(400).json({ error: "userId (email), code и projectId обязательны" });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT code, created_at FROM email_verification2 WHERE user_id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Код не найден" });
    }

    const { code: storedCode, created_at } = rows[0];
    const expired = new Date(created_at) < new Date(Date.now() - 10 * 60 * 1000);

    if (expired) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Код истёк" });
    }

    if (storedCode.trim() !== code.trim()) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Неверный код" });
    }

    const voteCheck = await client.query(
      `SELECT * FROM votes WHERE user_id = $1`,
      [userId]
    );

    if (voteCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "С этого email уже был отдан голос" });
    }

    await client.query(
      `INSERT INTO votes (user_id, project_id) VALUES ($1, $2)`,
      [userId, projectId]
    );

    await client.query(`DELETE FROM email_verification2 WHERE user_id = $1`, [userId]);

    await client.query("COMMIT");
    res.json({ message: "Голос засчитан!" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Ошибка при подтверждении и голосовании:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release();
  }
});

app.post("/api/email/send-code2", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Не указан email" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await db.query(`DELETE FROM email_verification2 WHERE user_id = $1`, [email]);

    await db.query(
      `INSERT INTO email_verification2 (user_id, email, code) VALUES ($1, $2, $3)`,
      [email, email, code] 
    );

    const mailOptions = {
      from: config.smtp.user,
      to: email,
      subject: "Ваш код для подтверждения",
      text: `Ваш код для подтверждения: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Ошибка при отправке письма:", error);
        return res.status(500).json({ error: "Ошибка отправки письма" });
      }

      console.log("📩 Письмо отправлено:", info.response);
      res.json({ message: "Код отправлен на email" });
    });
  } catch (err) {
    console.error("❌ Ошибка при сохранении кода:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post('/api/getUserAddress', async (req, res) => {
  const { accountNumber } = req.body;
  try {
    const user = await User.findOne({ accountNumber });
    console.log(user); 
    if (user) {
      res.json({
        city: user.city,
        street: user.street,
        house: user.house,
        apartment: user.apartment
      });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Ошибка на сервере' });
  }
});

app.get("/api/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("❌ Ошибка загрузки новостей:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
    res.json(results.rows);
  });
});

app.post("/api/news", (req, res) => {
  const { title, content, userId, tag } = req.body;

  if (!title || !content || !userId) {
    return res.status(400).json({ error: "Заголовок, текст и userId обязательны" });
  }

  const checkUserQuery = "SELECT is_special_user FROM users WHERE user_id = $1";
  db.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("❌ Ошибка при проверке пользователя:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    if (results.rows.length === 0 || !results.rows[0].is_special_user) {
      return res.status(403).json({ error: "Нет прав на добавление новостей" });
    }

    const insertQuery = "INSERT INTO news (title, content, tag) VALUES ($1, $2, $3)";
    db.query(insertQuery, [title, content, tag || null], (err) => {
      if (err) {
        console.error("❌ Ошибка при добавлении новости:", err);
        return res.status(500).json({ error: "Ошибка сервера" });
      }
      console.log("✅ Новость добавлена!");
      res.json({ success: true, message: "Новость добавлена" });
    });
  });
});

app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params; 
  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ error: "Не указан userId" });
  }

  const checkUserQuery = "SELECT is_special_user FROM users WHERE user_id = $1";
  db.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("❌ Ошибка при проверке пользователя:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    if (results.rows.length === 0 || !results.rows[0].is_special_user) {
      return res.status(403).json({ error: "Нет прав на удаление новостей" });
    }

    const deleteQuery = "DELETE FROM news WHERE id = $1";
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error("❌ Ошибка при удалении новости:", err);
        return res.status(500).json({ error: "Ошибка при удалении новости" });
      }
      res.json({ success: true, message: "Новость удалена" });
    });
  });
});

app.post('/api/user/profile', async (req, res) => {
  console.log('Запрос на /api/user/profile:', req.body);
  const { userId, lastName, firstName, middleName, phone, email, isEmailVerified } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  const deleteQuery = 'DELETE FROM user_profiles WHERE user_id = $1';

  try {
    await db.query(deleteQuery, [userId]);

    const insertQuery = `
      INSERT INTO user_profiles (user_id, last_name, first_name, middle_name, phone, email, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await db.query(insertQuery, [userId, lastName, firstName, middleName, phone, email, isEmailVerified || false]);

    res.json({ message: 'Данные профиля сохранены' });
  } catch (err) {
    console.error('Ошибка при сохранении профиля:', err);
    res.status(500).json({ error: 'Ошибка при сохранении профиля' });
  }
});

app.get("/api/user/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId обязателен" });
  }

  try {
    const result = await db.query(
      `SELECT last_name, first_name, middle_name, phone, email, email_verified, 
              CASE WHEN (last_name IS NOT NULL AND first_name IS NOT NULL AND 
                        middle_name IS NOT NULL AND phone IS NOT NULL AND 
                        email IS NOT NULL AND email_verified = TRUE) 
                   THEN TRUE 
                   ELSE FALSE 
              END as is_profile_complete
       FROM user_profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Профиль не найден" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при получении профиля:", err);
    res.status(500).json({ error: "Ошибка при получении профиля" });
  }
});

app.get("/api/user/addresses/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId обязателен" });
  }

  try {
    const result = await db.query(
      `SELECT city, street, house, apartment, contract_number, account_number
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Адреса не найдены" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении адресов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/api/meter-readings", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Не указан userId" });
  }

  const query = `
    SELECT hot_water, cold_water, electricity, reading_date
    FROM meter_readings
    WHERE user_id = $1
    ORDER BY reading_date DESC
  `;

  try {
    const { rows } = await db.query(query, [userId]);

    if (rows.length === 0) {
      return res.json({
        currentReadings: { hot_water: 0, cold_water: 0, electricity: 0 },
        previousReadings: { hot_water: 0, cold_water: 0, electricity: 0 },
        difference: { hot_water: 0, cold_water: 0, electricity: 0 }
      });
    }

    const grouped = {};
    for (const row of rows) {
      const key = row.reading_date.toISOString().slice(0, 7); 
      if (!grouped[key]) grouped[key] = row;
    }

    const sortedMonths = Object.keys(grouped).sort().reverse();
    const current = grouped[sortedMonths[0]] || { hot_water: 0, cold_water: 0, electricity: 0 };
    const previous = grouped[sortedMonths[1]] || { hot_water: 0, cold_water: 0, electricity: 0 };

    const difference = {
      hot_water: current.hot_water - previous.hot_water,
      cold_water: current.cold_water - previous.cold_water,
      electricity: current.electricity - previous.electricity
    };

    res.json({ currentReadings: current, previousReadings: previous, difference });
  } catch (err) {
    console.error("❌ Ошибка при получении показаний:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/meter-readings", async (req, res) => {
  const { userId, hotWater, coldWater, electricity, readingDate } = req.body;

  if (!userId || !readingDate) {
    return res.status(400).json({ error: "Не указан userId или дата показаний" });
  }

  const formattedDate = readingDate.substring(0, 7); 

  try {
    const { rows } = await db.query(`
      SELECT id, reading_date
      FROM meter_readings
      WHERE user_id = $1
      ORDER BY reading_date DESC
    `, [userId]);

    if (rows.length >= 2) {
      const oldestId = rows[rows.length - 1].id;
      await db.query(`DELETE FROM meter_readings WHERE id = $1`, [oldestId]);
      console.log("🗑 Старые показания удалены");
    }

    const existing = rows.find(r => r.reading_date.toISOString().substring(0, 7) === formattedDate);

    if (existing) {
      await db.query(`
        UPDATE meter_readings
        SET hot_water = $1, cold_water = $2, electricity = $3, reading_date = $4
        WHERE id = $5
      `, [hotWater, coldWater, electricity, readingDate, existing.id]);

      return res.json({ success: true, message: "Показания обновлены" });
    } else {
      await db.query(`
        INSERT INTO meter_readings (user_id, hot_water, cold_water, electricity, reading_date)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, hotWater, coldWater, electricity, readingDate]);

      return res.json({ success: true, message: "Показания добавлены" });
    }
  } catch (err) {
    console.error("❌ Ошибка при сохранении показаний:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/api/calculate-payment", async (req, res) => {
  const { userId, selectedServices, selectedMonth } = req.query;

  if (!userId || !selectedServices || !selectedMonth) {
    return res.status(400).json({ error: "Не указан userId, услуги или месяц" });
  }

  const selectedServicesArray = selectedServices.split(",").map(s => s.trim()).filter(Boolean);

  const tariffs = {
    heating: 500,
    maintenance: 300,
    hot_water: 17.51,
    cold_water: 80.69,
    electricity: 4.70
  };

  let totalAmount = 0;
  const details = {
    heating: 0,
    maintenance: 0,
    hot_water: 0,
    cold_water: 0,
    electricity: 0
  };

  const monthsMap = {
    января: 1,
    февраля: 2,
    марта: 3,
    апреля: 4,
    мая: 5,
    июня: 6,
    июля: 7,
    августа: 8,
    сентября: 9,
    октября: 10,
    ноября: 11,
    декабря: 12
  };

  const [monthName, year] = selectedMonth.split(" ");
  const monthNumber = monthsMap[monthName.toLowerCase()];
  if (!monthNumber || !year) {
    return res.status(400).json({ error: "Некорректный формат месяца" });
  }
  const formattedMonth = `${year}-${monthNumber.toString().padStart(2, "0")}`;

  console.log(formattedMonth); 

  if (selectedServicesArray.includes("heating")) {
    details.heating = tariffs.heating;
    totalAmount += tariffs.heating;
  }

  if (selectedServicesArray.includes("maintenance")) {
    details.maintenance = tariffs.maintenance;
    totalAmount += tariffs.maintenance;
  }

  const prevMonthDate = new Date(Number(year), monthNumber - 2); 
  const prevMonth = prevMonthDate.toISOString().slice(0, 7);

  try {
    const paidRes = await db.query(
      `SELECT reading_date FROM paid_services WHERE user_id = $1`,
      [userId]
    );
    const paidMonths = paidRes.rows.map(row => row.reading_date.toISOString().slice(0, 7));

    const readingsRes = await db.query(
      `SELECT hot_water, cold_water, electricity, to_char(reading_date, 'YYYY-MM') AS month
       FROM meter_readings
       WHERE user_id = $1 AND to_char(reading_date, 'YYYY-MM') IN ($2, $3)
       ORDER BY reading_date`,
      [userId, formattedMonth, prevMonth]
    );

    const readings = {};
    readingsRes.rows.forEach(row => {
      readings[row.month] = row;
    });

    const current = readings[formattedMonth];
    const previous = readings[prevMonth];

    if (!current) {
      return res.json({
        totalAmount: totalAmount.toFixed(2),
        paidMonths,
        warning: `Нет показаний за выбранный месяц: ${formattedMonth}`
      });
    }

    if (!previous) {
      return res.json({
        totalAmount: totalAmount.toFixed(2),
        paidMonths,
        warning: `Нет показаний за предыдущий месяц: ${prevMonth}`
      });
    }

    const consumption = {
      hot_water: Math.max(parseFloat(current.hot_water) - parseFloat(previous.hot_water), 0),
      cold_water: Math.max(parseFloat(current.cold_water) - parseFloat(previous.cold_water), 0),
      electricity: Math.max(parseFloat(current.electricity) - parseFloat(previous.electricity), 0)
    };

    if (selectedServicesArray.includes("hot_water")) {
      details.hot_water = +(consumption.hot_water * tariffs.hot_water).toFixed(2);
      totalAmount += details.hot_water;
    }

    if (selectedServicesArray.includes("cold_water")) {
      details.cold_water = +(consumption.cold_water * tariffs.cold_water).toFixed(2);
      totalAmount += details.cold_water;
    }

    if (selectedServicesArray.includes("electricity")) {
      details.electricity = +(consumption.electricity * tariffs.electricity).toFixed(2);
      totalAmount += details.electricity;
    }

    res.json({
      totalAmount: totalAmount.toFixed(2),
      paidMonths,
      details
    });

  } catch (err) {
    console.error("❌ Ошибка при расчете платежа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/payments", async (req, res) => {
  const { userId, readingDate, services, totalAmount, paymentMethod, details } = req.body;

  if (!userId || !readingDate || !services || !Array.isArray(services) || !totalAmount || !paymentMethod || !details) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  const monthStr = readingDate.slice(0, 7); 

  try {
    const checkQuery = `
      SELECT 1 FROM paid_services 
      WHERE user_id = $1 AND to_char(reading_date, 'YYYY-MM') = $2
    `;
    const checkRes = await db.query(checkQuery, [userId, monthStr]);

    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: "Оплата за этот месяц уже произведена" });
    }

        const insertQuery = `
  INSERT INTO paid_services 
  (user_id, cold_water, hot_water, electricity, reading_date, sum, payment_method, services, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
`;

await db.query(insertQuery, [
  userId,
  details.cold_water || 0,
  details.hot_water || 0,
  details.electricity || 0,
  readingDate,
  totalAmount,
  paymentMethod,
  JSON.stringify(services)
]);

    res.json({ success: true, message: "Оплата успешно сохранена" });
  } catch (err) {
    console.error("❌ Ошибка при записи оплаты:", err);
    res.status(500).json({ error: "Ошибка сервера при сохранении оплаты" });
  }
});

app.post("/api/save-payment", async (req, res) => {
  const { userId, selectedMonth, details, selectedServices, totalAmount, paymentMethod } = req.body;

  if (!userId || !selectedMonth || totalAmount === undefined || !paymentMethod) {
    return res.status(400).json({ error: "Некорректные данные (отсутствуют обязательные поля)" });
  }

  let coldWater = 0, hotWater = 0, electricity = 0;

  if (details) {
    coldWater = details.cold_water || 0;
    hotWater = details.hot_water || 0;
    electricity = details.electricity || 0;
  } else if (Array.isArray(selectedServices)) {
    coldWater = selectedServices.includes("cold_water") ? 1 : 0;
    hotWater = selectedServices.includes("hot_water") ? 1 : 0;
    electricity = selectedServices.includes("electricity") ? 1 : 0;
  } else {
    return res.status(400).json({ error: "Не передан ни объект details, ни список selectedServices" });
  }

  const readingDate = `${selectedMonth}-01 00:00:00`;
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const insertQuery = `
      INSERT INTO paid_services 
      (user_id, cold_water, hot_water, electricity, reading_date, sum, created_at, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await db.query(insertQuery, [
      userId,
      coldWater,
      hotWater,
      electricity,
      readingDate,
      totalAmount,
      createdAt,
      paymentMethod
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Ошибка при сохранении данных в БД:", err);
    res.status(500).json({ error: "Ошибка сервера при сохранении данных оплаты" });
  }
});

app.get("/api/paid-months", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Отсутствует идентификатор пользователя" });
  }

  try {
    const readingsQuery = `
      SELECT DISTINCT to_char(reading_date, 'YYYY-MM') AS reading_month
      FROM meter_readings
      WHERE user_id = $1
      ORDER BY reading_month DESC
    `;
    const { rows: readingsRows } = await db.query(readingsQuery, [userId]);
    const readingMonths = readingsRows.map(row => row.reading_month);

    const paidQuery = `
      SELECT DISTINCT to_char(reading_date, 'YYYY-MM') AS paid_month
      FROM paid_services
      WHERE user_id = $1
      ORDER BY paid_month DESC
    `;
    const { rows: paidRows } = await db.query(paidQuery, [userId]);
    const paidMonths = paidRows.map(row => row.paid_month);

    const unpaidMonths = readingMonths.filter(month => !paidMonths.includes(month));

    if (unpaidMonths.length === 0) {
      return res.json({ message: "Все месяцы оплачены" });
    }

    res.json({ unpaidMonths });
  } catch (err) {
    console.error("❌ Ошибка при извлечении месяцев:", err);
    res.status(500).json({ error: "Ошибка сервера при извлечении данных" });
  }
});

app.get("/api/unpaid-months", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Не указан userId" });
  }

  try {
    const paidRes = await db.query(
      `SELECT to_char(reading_date, 'YYYY-MM') AS month 
       FROM paid_services 
       WHERE user_id = $1`, 
      [userId]
    );
    const paidMonths = paidRes.rows.map(row => row.month);

    const readingsRes = await db.query(
      `SELECT DISTINCT to_char(reading_date, 'YYYY-MM') AS month 
       FROM meter_readings 
       WHERE user_id = $1`, 
      [userId]
    );
    const allMonths = readingsRes.rows.map(row => row.month);

    const unpaidMonths = allMonths.filter(month => !paidMonths.includes(month));

    res.json({ unpaidMonths });

  } catch (err) {
    console.error("❌ Ошибка при получении неоплаченных месяцев:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/applications2", async (req, res) => {
  const { type, description, date, time, phone } = req.body;

  console.log("Полученные данные заявки:", req.body);

  if (!description) {
    return res.status(400).json({ message: "Описание проблемы обязательно" });
  }

  const sql = `
    INSERT INTO Applications2 (type, description, date, time, phone)
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `;
  const params = [type, description, date, time, phone];

  console.log("Запрос к базе данных:", sql);
  console.log("Параметры запроса:", params);

  try {
    const result = await db.query(sql, params);
    const applicationId = result.rows[0].id;

    console.log("✅ Заявка успешно записана в базу данных, ID заявки:", applicationId);
    res.json({ message: "Заявка принята!" });

    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (!notifyEmail) {
      console.error("❌ Не задан email для уведомлений (NOTIFY_EMAIL)");
      return;
    }

    const typeLabels = {
      plumbing: "Сантехника",
      electrical: "Электрика",
      construction: "Строительные работы",
      other: "Другое",
    };

    const translatedType = typeLabels[type] || type;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: notifyEmail,
      subject: "Новая заявка на ремонт",
      text: `Новая заявка на ремонт:\n
Тип: ${translatedType}
Описание: ${description}
Дата: ${date || "не указана"}
Время: ${time || "не указано"}
Телефон: ${phone || "не указан"}\n
Пожалуйста, свяжитесь с клиентом.`,
    };

    console.log("Параметры отправки email:", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Ошибка отправки email:", error);
        return;
      }
      console.log("📩 Email отправлен:", info.response);
    });
  } catch (err) {
    console.error("❌ Ошибка записи в базу данных:", err);
    return res.status(500).json({ error: "Ошибка сервера. Не удалось сохранить заявку." });
  }
});

app.post("/api/email/send-code", async (req, res) => {
  const { userId, email } = req.body;
  if (!userId || !email) {
    return res.status(400).json({ error: "userId и email обязательны" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); 

  const client = await db.connect();
  try {
    await client.query('BEGIN'); 

    await client.query(`
      INSERT INTO email_verification (user_id, email, code)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO UPDATE
      SET code = EXCLUDED.code, created_at = CURRENT_TIMESTAMP
    `, [userId, email, code]);

    await transporter.sendMail({
      from: `"Регион 42" <${config.smtp.user}>`,
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код подтверждения: ${code}`,
    });

    await client.query('COMMIT'); 
    res.json({ message: "Код отправлен на email" });
  } catch (err) {
    await client.query('ROLLBACK'); 
    console.error("Ошибка при отправке email:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  } finally {
    client.release(); 
  }
});

app.post("/api/email/verify", async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ error: "userId и code обязательны" });
  }

  try {
    const userCheck = await db.query(`
      SELECT user_id FROM users WHERE user_id = $1
    `, [userId]);

    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "Пользователь не найден" });
    }

    const result = await db.query(`
      SELECT code, created_at FROM email_verification WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Код не найден" });
    }

    const { code: storedCode, created_at } = result.rows[0];
    const expired = new Date(created_at) < new Date(Date.now() - 10 * 60 * 1000); 

    if (expired) {
      return res.status(400).json({ error: "Код истёк" });
    }

    if (storedCode.trim().toLowerCase() !== code.trim().toLowerCase()) {
      console.log(`Код не совпадает. В базе: '${storedCode}', пришёл: '${code}'`);
      return res.status(400).json({ error: "Неверный код" });
    }

    const updateResult = await db.query(`
      UPDATE user_profiles SET email_verified = TRUE WHERE user_id = $1 RETURNING email_verified
    `, [userId]);

    if (updateResult.rowCount === 0) {
      console.log("❌ UPDATE не сработал — user_id не найден в user_profiles");
      return res.status(400).json({ error: "Пользователь не найден в профиле" });
    }

    await db.query(`
      DELETE FROM email_verification WHERE user_id = $1
    `, [userId]);

    res.json({ message: "Email успешно подтвержден" });
  } catch (err) {
    console.error("Ошибка при подтверждении email:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post('/api/user/register', async (req, res) => {
  console.log('Запрос на /api/user/register:', req.body);
  const { city, street, house, apartment, contract, accountNumber } = req.body;

  if (!city || !street || !house || !contract || !accountNumber) {
    return res.status(400).json({
      error: "Пожалуйста, заполните все обязательные поля."
    });
  }

  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const insertUserQuery = `
      INSERT INTO users (
        login_type, contract_number, city, street, house, apartment, account_number, created_at, is_special_user
      ) VALUES (
        'address', $1, $2, $3, $4, $5, $6, $7, false
      )
      RETURNING user_id
    `;

    const userValues = [
      contract,
      city,
      street,
      house,
      apartment || null,
      accountNumber,
      createdAt,
    ];

    const result = await client.query(insertUserQuery, userValues);
    const userId = result.rows[0].user_id;

    const insertProfileQuery = `
      INSERT INTO user_profiles (
        user_id, created_at
      ) VALUES (
        $1, $2
      )
    `;

    const profileValues = [userId, createdAt];
    await client.query(insertProfileQuery, profileValues);

    await client.query('COMMIT');

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      userId,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка при регистрации пользователя:', err);
    res.status(500).json({
      error: "Ошибка при регистрации, попробуйте позже.",
    });
  } finally {
    client.release();
  }
});

const buildPath = path.resolve(__dirname, './dist');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${config.port}`);
});
