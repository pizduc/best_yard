import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // Укажите своего пользователя
    password: '121032', // Укажите пароль, если есть
    multipleStatements: true
});

const sql = `
    CREATE DATABASE IF NOT EXISTS competition;
    USE competition;
    CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        number VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

try {
    await connection.query(sql);
    console.log("База данных и таблица успешно созданы!");
} catch (err) {
    console.error("Ошибка при создании базы данных и таблицы:", err);
} finally {
    await connection.end();
}
