
const { pool } = require('../config/db');

// Контроллеры для работы с проектами благоустройства дворов

// Получить все проекты
async function getAllProjects(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    res.status(500).json({ error: 'Не удалось получить список проектов' });
  }
}

// Получить проект по ID
async function getProjectById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Ошибка при получении проекта:', error);
    res.status(500).json({ error: 'Не удалось получить проект' });
  }
}

// Создать новый проект
async function createProject(req, res) {
  const { title, description, address, images, status } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO projects (title, description, address, images, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, address, JSON.stringify(images), status]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Проект успешно создан' });
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    res.status(500).json({ error: 'Не удалось создать проект' });
  }
}

// Обновить проект
async function updateProject(req, res) {
  const { title, description, address, images, status } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE projects SET title = ?, description = ?, address = ?, images = ?, status = ? WHERE id = ?',
      [title, description, address, JSON.stringify(images), status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json({ message: 'Проект успешно обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    res.status(500).json({ error: 'Не удалось обновить проект' });
  }
}

// Удалить проект
async function deleteProject(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json({ message: 'Проект успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.status(500).json({ error: 'Не удалось удалить проект' });
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
