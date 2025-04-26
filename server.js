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
  origin: config.cors.origins,
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

const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Старт сервера
app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${config.port}`);
});
