import express from "express";
import { Client } from "pg";  // Используем библиотеку pg для PostgreSQL
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

console.log("🚀 Сервер перезапущен и готов к работе!");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

// Подключение к PostgreSQL
const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,  // Убедитесь, что порт правильный
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Ошибка подключения к БД:", err);
    process.exit(1); // Завершаем процесс, если не удалось подключиться
  }
  console.log("✅ Подключено к PostgreSQL");
});

// Настройка SMTP для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // Автоматическое определение secure
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// API для подачи заявки
app.post("/api/applications", (req, res) => {
  const { name, email, number, address, description } = req.body;

  if (!name || !email || !number || !address || !description) {
    return res.status(400).json({ error: "Все поля должны быть заполнены!" });
  }

  const sql = "INSERT INTO applications (name, email, number, address, description) VALUES ($1, $2, $3, $4, $5)";
  db.query(sql, [name, email, number, address, description], (err, result) => {
    if (err) {
      console.error("❌ Ошибка записи в базу данных:", err);
      return res.status(500).json({ error: "Ошибка сервера" });
    }

    res.json({ message: "Заявка принята!" });

    // Асинхронно отправляем email (не блокируем основной поток)
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Подтверждение заявки",
      text: `Здравствуйте, ${name}!\n\nВаша заявка принята.\n\nДетали:\n- Адрес: ${address}\n- Телефон: ${number}\n- Описание: ${description}\n\nМы свяжемся с вами.\n\nС уважением,\nОрганизаторы конкурса.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Ошибка отправки email:", error);
      } else {
        console.log("📩 Email отправлен:", info.response);
      }
    });
  });
});

// Подсказки (Geo Suggest)
app.get("/api/suggest", async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ error: "Необходимо указать параметры query и type" });
  }

  try {
    const response = await axios.get("https://suggest-maps.yandex.ru/v1/suggest", {
      params: {
        apikey: process.env.YANDEX_API_KEY,
        text: query,
        lang: "ru_RU",
        types: type,
      },
    });

    console.log("✅ Ответ от Яндекс API:", response.data);
    const suggestions = response.data.results.map((item) => item.title.text);
    res.json({ suggestions });
  } catch (error) {
    console.error("❌ Ошибка при запросе к Яндекс API:", error.message);
    if (error.response) {
      console.error("Ответ ошибки от Яндекс API:", error.response.data);
    }
    res.status(500).json({ error: "Ошибка при запросе к Яндекс API" });
  }
});

// Подсказка ФИО через Dadata
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
          Authorization: `Token ${process.env.DADATA_API_KEY}`,
        },
      }
    );

    console.log("✅ Ответ от Dadata:", response.data);
    const suggestions = Array.isArray(response.data.suggestions) ? response.data.suggestions : [];
    res.json({ suggestions });
  } catch (error) {
    console.error("❌ Ошибка при запросе к Dadata API:", error.message);
    if (error.response) {
      console.error("Ответ ошибки от Dadata API:", error.response.data);
    }
    res.status(500).json({ error: "Ошибка при запросе к Dadata API" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
