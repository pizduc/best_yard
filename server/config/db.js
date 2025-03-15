
// Конфигурация для подключения к MySQL
// Вы сможете настроить подключение к вашей базе данных здесь

const mysql = require('mysql2/promise');

// Создаем пул соединений для MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yard_competition',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Проверка соединения
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Соединение с базой данных установлено успешно');
    connection.release();
    return true;
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return false;
  }
}

module.exports = {
  pool,
  checkConnection
};
