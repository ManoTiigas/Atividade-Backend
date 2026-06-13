const { Router } = require('express');
const TaskController = require('../controllers/task.controller');

const router = Router();

router.get('/stats', TaskController.stats);
router.get('/', TaskController.list);
router.get('/:id', TaskController.getOne);
router.post('/', TaskController.create);
router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.remove);

module.exports = router;
