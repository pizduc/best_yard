
-- Создание базы данных
CREATE DATABASE IF NOT EXISTS yard_competition DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yard_competition;

-- Таблица проектов благоустройства
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address VARCHAR(255) NOT NULL,
  images JSON DEFAULT NULL,
  status ENUM('Запланирован', 'В процессе', 'Завершен') DEFAULT 'Запланирован',
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица участников конкурса
CREATE TABLE IF NOT EXISTS participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Новая заявка', 'На рассмотрении', 'Одобрена', 'Отклонена') DEFAULT 'Новая заявка',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей (админов)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем тестовые данные (опционально)
INSERT INTO projects (title, description, address, images, status) VALUES
('Благоустройство двора на ул. Ленина 45', 'Проект включает озеленение территории, установку детской площадки и зоны отдыха для пожилых людей', 'г. Кемерово, ул. Ленина, 45', '["image1.jpg", "image2.jpg"]', 'В процессе'),
('Обновление двора по пр. Октябрьский 78', 'Ремонт асфальтового покрытия, установка скамеек и урн, посадка деревьев', 'г. Кемерово, пр. Октябрьский, 78', '["image3.jpg"]', 'Запланирован'),
('Реконструкция двора на ул. Весенняя 20', 'Комплексное благоустройство с заменой освещения, асфальтированием и озеленением', 'г. Кемерово, ул. Весенняя, 20', '["image4.jpg", "image5.jpg", "image6.jpg"]', 'Завершен');
