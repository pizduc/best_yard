import express from "express";
import { Pool } from "pg";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js"; // Подключаем конфиг

dotenv.config();

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Pool(config.db);

// Настройки CORS
app.use(cors({
  origin: ["https://region42.onrender.com", "http://localhost:8080"], // явно указываешь допустимый фронт
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));


// Настройка для обработки JSON
app.use(express.json());

// Подключение к БД
db.connect((err) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err);
    process.exit(1);
  }
  console.log("✅ Подключено к PostgreSQL");
});

// Настройка отправки почты
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

// API: Приём заявок
app.post("/api/applications", (req, res) => {
  const { name, email, number, address, description } = req.body;

  if (!name || !email || !number || !address || !description) {
    return res.status(400).json({ error: "Все поля должны быть заполнены!" });
  }

  const sql = `
    INSERT INTO applications (name, email, number, address, description)
    VALUES ($1, $2, $3, $4, $5)
  `;

  db.query(sql, [name, email, number, address, description], (err) => {
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

// API: Подсказки адресов через Яндекс
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

// API: Подсказки ФИО через Dadata
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
      if (!city || !street || !house || !apartment || !contract) {
        return res.status(400).json({ error: "Недостаточно данных для входа по адресу" });
      }

      query = `
        SELECT user_id, is_special_user FROM users
        WHERE city = $1 AND street = $2 AND house = $3 AND apartment = $4 AND contract_number = $5
      `;
      values = [city, street, house, apartment, contract];

    } else if (loginType === "account") {
      if (!accountNumber) {
        return res.status(400).json({ error: "Не указан номер лицевого счёта" });
      }

      query = `
        SELECT user_id, is_special_user FROM users
        WHERE account_number = $1
      `;
      values = [accountNumber];

    } else {
      return res.status(400).json({ error: "Некорректный тип логина" });
    }

    console.log("SQL-запрос:", query);
    console.log("Значения:", values);

    const result = await db.query(query, values);
    console.log("Результаты запроса:", result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.json({
        success: true,
        userId: user.user_id,
        isSpecialUser: Boolean(user.is_special_user),
      });
    } else {
      return res.status(401).json({ success: false, error: "Пользователь не найден" });
    }

  } catch (err) {
    console.error("Ошибка при логине:", err);
    return res.status(500).json({ error: "Ошибка сервера при логине", details: err.message });
  }
});


// Пример API для получения данных пользователя по лицевому счету
app.post('/api/getUserAddress', async (req, res) => {
  const { accountNumber } = req.body;
  try {
    const user = await User.findOne({ accountNumber });
    console.log(user); // Логируем данные пользователя
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

// ✅ Получение всех новостей
app.get("/api/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("❌ Ошибка загрузки новостей:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
    res.json(results.rows);
  });
});

// ✅ Добавление новости (только для specialUser)
app.post("/api/news", (req, res) => {
  const { title, content, userId } = req.body;
  
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

    const insertQuery = "INSERT INTO news (title, content) VALUES ($1, $2)";
    db.query(insertQuery, [title, content], (err) => {
      if (err) {
        console.error("❌ Ошибка при добавлении новости:", err);
        return res.status(500).json({ error: "Ошибка сервера" });
      }
      console.log("✅ Новость добавлена!");
      res.json({ success: true, message: "Новость добавлена" });
    });
  });
});

// Маршрут для удаления новости
app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params;  // Получаем ID новости из параметров URL
  const { userId } = req.query; // Получаем userId из query-параметра

  if (!userId) {
    return res.status(400).json({ error: "Не указан userId" });
  }

  // Проверка, является ли пользователь особым (specialUser)
  const checkUserQuery = "SELECT is_special_user FROM users WHERE user_id = $1";
  db.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("❌ Ошибка при проверке пользователя:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    if (results.rows.length === 0 || !results.rows[0].is_special_user) {
      return res.status(403).json({ error: "Нет прав на удаление новостей" });
    }

    // Удаление новости из базы данных
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

// Получение данных профиля
app.get('/api/user/profile/:userId', async (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT * FROM user_profiles WHERE user_id = $1';

  try {
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Профиль не найден' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

// Сохранение или обновление данных профиля (POST)
app.post('/api/user/profile', async (req, res) => {
  console.log('Запрос на /api/user/profile:', req.body);
  const { userId, lastName, firstName, middleName, phone, email } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  const deleteQuery = 'DELETE FROM user_profiles WHERE user_id = $1';

  try {
    // Удаляем старые данные
    await db.query(deleteQuery, [userId]);

    const insertQuery = `
      INSERT INTO user_profiles (user_id, last_name, first_name, middle_name, phone, email)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    // Добавляем новые данные
    await db.query(insertQuery, [userId, lastName, firstName, middleName, phone, email]);

    res.json({ message: 'Данные профиля сохранены' });
  } catch (err) {
    console.error('Ошибка при сохранении профиля:', err);
    res.status(500).json({ error: 'Ошибка при сохранении профиля' });
  }
});

// ✅ Получение последних показаний
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
      const key = row.reading_date.toISOString().slice(0, 7); // YYYY-MM
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

// ✅ Добавление или обновление показаний
app.post("/api/meter-readings", async (req, res) => {
  const { userId, hotWater, coldWater, electricity, readingDate } = req.body;

  if (!userId || !readingDate) {
    return res.status(400).json({ error: "Не указан userId или дата показаний" });
  }

  const formattedDate = readingDate.substring(0, 7); // YYYY-MM

  try {
    const { rows } = await db.query(`
      SELECT id, reading_date
      FROM meter_readings
      WHERE user_id = $1
      ORDER BY reading_date DESC
    `, [userId]);

    // Удаляем самые старые, если больше двух
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
  const { userId, selectedServices } = req.query;

  if (!userId || !selectedServices) {
    return res.status(400).json({ error: "Не указан userId или выбранные услуги" });
  }

  const selectedServicesArray = selectedServices.split(",").map(s => s.trim()).filter(Boolean);
  let totalAmount = 0;

  const tariffs = {
    heating: 500,
    maintenance: 300,
    hot_water: 17.51,
    cold_water: 80.69,
    electricity: 4.70
  };

  if (selectedServicesArray.includes("heating")) totalAmount += tariffs.heating;
  if (selectedServicesArray.includes("maintenance")) totalAmount += tariffs.maintenance;

  try {
    const paidRes = await db.query(
      `SELECT reading_date FROM paid_services WHERE user_id = $1`,
      [userId]
    );
    const paidMonths = paidRes.rows.map(row => row.reading_date.toISOString().slice(0, 7));

    const readingsRes = await db.query(
      `SELECT hot_water, cold_water, electricity, reading_date
       FROM meter_readings
       WHERE user_id = $1
       ORDER BY reading_date DESC
       LIMIT 2`,
      [userId]
    );

    const results = readingsRes.rows;

    if (results.length === 0) {
      return res.json({
        totalAmount: totalAmount.toFixed(2),
        paidMonths,
        warning: "Нет данных о предыдущих показаниях"
      });
    }

    const current = results[0];
    const previous = results[1] || { hot_water: 0, cold_water: 0, electricity: 0 };

    const consumption = {
      hot_water: Math.max(parseFloat(current.hot_water) - parseFloat(previous.hot_water), 0),
      cold_water: Math.max(parseFloat(current.cold_water) - parseFloat(previous.cold_water), 0),
      electricity: Math.max(parseFloat(current.electricity) - parseFloat(previous.electricity), 0)
    };

    if (selectedServicesArray.includes("hot_water")) totalAmount += consumption.hot_water * tariffs.hot_water;
    if (selectedServicesArray.includes("cold_water")) totalAmount += consumption.cold_water * tariffs.cold_water;
    if (selectedServicesArray.includes("electricity")) totalAmount += consumption.electricity * tariffs.electricity;

    res.json({
      totalAmount: totalAmount.toFixed(2),
      paidMonths,
      details: {
        heating: selectedServicesArray.includes("heating") ? tariffs.heating : 0,
        maintenance: selectedServicesArray.includes("maintenance") ? tariffs.maintenance : 0,
        hot_water: selectedServicesArray.includes("hot_water") ? consumption.hot_water * tariffs.hot_water : 0,
        cold_water: selectedServicesArray.includes("cold_water") ? consumption.cold_water * tariffs.cold_water : 0,
        electricity: selectedServicesArray.includes("electricity") ? consumption.electricity * tariffs.electricity : 0
      }
    });
  } catch (err) {
    console.error("❌ Ошибка при расчете платежа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/payments", async (req, res) => {
  const { userId, readingDate, services, totalAmount, paymentMethod } = req.body;

  if (!userId || !readingDate || !services || services.length === 0 || !totalAmount || !paymentMethod) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  // Извлекаем месяц из даты в формате 'YYYY-MM-DD HH:mm:ss.SSS'
  const monthStr = readingDate.slice(0, 7); // 'YYYY-MM'

  try {
    // Проверка, если оплата за этот месяц уже была произведена
    const checkQuery = `
      SELECT 1 FROM paid_services 
      WHERE user_id = $1 AND to_char(reading_date, 'YYYY-MM') = $2
    `;
    const checkRes = await db.query(checkQuery, [userId, monthStr]);

    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: "Оплата за этот месяц уже произведена" });
    }

    // Вставка данных об оплате
    const insertQuery = `
      INSERT INTO paid_services (user_id, reading_date, services, sum, payment_method)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(insertQuery, [userId, readingDate, JSON.stringify(services), totalAmount, paymentMethod]);

    res.json({ success: true, message: "Оплата успешно сохранена" });
  } catch (err) {
    console.error("❌ Ошибка при записи оплаты:", err);
    res.status(500).json({ error: "Ошибка сервера при сохранении оплаты" });
  }
});

app.post("/api/save-payment", async (req, res) => {
  const { userId, selectedMonth, selectedServices, totalAmount, paymentMethod } = req.body;

  if (!userId || !selectedMonth || !selectedServices || totalAmount === undefined || !paymentMethod) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  const readingDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const currentDate = readingDate;

  const coldWaterAmount = selectedServices.includes("cold_water") ? totalAmount * 0.2 : 0;
  const hotWaterAmount = selectedServices.includes("hot_water") ? totalAmount * 0.3 : 0;
  const electricityAmount = selectedServices.includes("electricity") ? totalAmount * 0.5 : 0;

  try {
    const insertQuery = `
      INSERT INTO paid_services 
      (user_id, cold_water, hot_water, electricity, reading_date, sum, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await db.query(insertQuery, [
      userId,
      coldWaterAmount,
      hotWaterAmount,
      electricityAmount,
      readingDate,
      totalAmount,
      currentDate
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
    // Извлекаем все месяцы с показаниями счетчиков
    const readingsQuery = `
      SELECT DISTINCT to_char(reading_date, 'YYYY-MM') AS reading_month
      FROM meter_readings
      WHERE user_id = $1
      ORDER BY reading_month DESC
    `;
    const { rows: readingsRows } = await db.query(readingsQuery, [userId]);
    const readingMonths = readingsRows.map(row => row.reading_month);

    // Извлекаем все месяцы, за которые была произведена оплата
    const paidQuery = `
      SELECT DISTINCT to_char(reading_date, 'YYYY-MM') AS paid_month
      FROM paid_services
      WHERE user_id = $1
      ORDER BY paid_month DESC
    `;
    const { rows: paidRows } = await db.query(paidQuery, [userId]);
    const paidMonths = paidRows.map(row => row.paid_month);

    // Находим месяцы, за которые нет оплаты
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

app.post("/api/applications2", async (req, res) => {
  const { type, description, date, time, phone } = req.body;

  console.log("Полученные данные заявки:", req.body);

  if (!description) {
    return res.status(400).json({ message: "Описание проблемы обязательно" });
  }

  const sql = `
    INSERT INTO Applications (type, description, date, time, phone)
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `;
  const params = [type, description, date, time, phone];

  console.log("Запрос к базе данных:", sql);
  console.log("Параметры запроса:", params);

  try {
    // Выполняем запрос к базе данных PostgreSQL
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

const buildPath = path.resolve(__dirname, './dist');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Старт сервера
app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${config.port}`);
});
