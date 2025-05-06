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

const buildPath = path.resolve(__dirname, './dist');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Старт сервера
app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${config.port}`);
});
