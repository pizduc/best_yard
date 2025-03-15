
const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const participantsController = require('../controllers/participantsController');

// Маршруты для проектов
router.get('/projects', projectsController.getAllProjects);
router.get('/projects/:id', projectsController.getProjectById);
router.post('/projects', projectsController.createProject);
router.put('/projects/:id', projectsController.updateProject);
router.delete('/projects/:id', projectsController.deleteProject);

// Маршруты для участников
router.get('/participants', participantsController.getAllParticipants);
router.post('/participants', participantsController.registerParticipant);

// Тестовый маршрут для проверки API
router.get('/test', (req, res) => {
  res.json({ message: 'API работает!' });
});

module.exports = router;
