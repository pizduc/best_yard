import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // <-- обязательно для Render!
  }
});


const sql = `
  CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function setup() {
  try {
    await client.connect();
    await client.query(sql);
    console.log("Таблица успешно создана в PostgreSQL!");
  } catch (err) {
    console.error("Ошибка при создании таблицы:", err);
  } finally {
    await client.end();
  }
}

setup();
