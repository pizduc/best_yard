import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Абсолютный путь к сертификату в корне проекта
const sslCertPath = path.resolve(process.cwd(), "prod-ca-2021.crt");

const config = {
  port: process.env.PORT || 10000,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isProduction
      ? {
          ca: fs.readFileSync(sslCertPath).toString(),
          rejectUnauthorized: true,
        }
      : false,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  apis: {
    dadataApiKey: process.env.DADATA_API_KEY,
    yandexApiKey: process.env.YANDEX_API_KEY,
  },
  cors: {
    origins: isProduction
      ? ["https://best-yard.onrender.com"]
      : ["http://localhost:8080"],
  },
};

export default config;
