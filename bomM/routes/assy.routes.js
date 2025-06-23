const Router = require('express').Router;
const router = new Router();
const assyController = require('../controllers/assy.controller');

router.post('/assy', assyController.createAssy);
router.get('/assy', assyController.getAssy);

// Маршрут для поиска должен быть объявлен ДО маршрута /assy/:id
router.get('/assy/search', assyController.searchAssy);

router.get('/assy/:id', assyController.getOneAssy);
router.put('/assy/:id', assyController.updateAssy);
router.delete('/assy/:id', assyController.deleteAssy);

// Маршрут для получения дерева сборки
router.get('/assy/:id/tree', assyController.getAssemblyTree);

module.exports = router;