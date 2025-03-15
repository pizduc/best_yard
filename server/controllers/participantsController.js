
const { pool } = require('../config/db');

// Контроллеры для работы с участниками конкурса

// Получить всех участников
async function getAllParticipants(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM participants ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении участников:', error);
    res.status(500).json({ error: 'Не удалось получить список участников' });
  }
}

// Зарегистрировать нового участника
async function registerParticipant(req, res) {
  const { name, email, phone, address, description } = req.body;
  
  // Проверка обязательных полей
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
  }
  
  try {
    // Проверка на уникальность email
    const [existingParticipants] = await pool.query('SELECT * FROM participants WHERE email = ?', [email]);
    
    if (existingParticipants.length > 0) {
      return res.status(400).json({ error: 'Участник с таким email уже зарегистрирован' });
    }
    
    // Добавление нового участника
    const [result] = await pool.query(
      'INSERT INTO participants (name, email, phone, address, description) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, address, description]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Вы успешно зарегистрированы в конкурсе' 
    });
  } catch (error) {
    console.error('Ошибка при регистрации участника:', error);
    res.status(500).json({ error: 'Не удалось зарегистрировать участника' });
  }
}

module.exports = {
  getAllParticipants,
  registerParticipant
};
