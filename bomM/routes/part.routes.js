const Router = require('express').Router;
const router = new Router();
const partController = require('../controllers/part.controller');

router.post('/part', partController.createPart);
router.get('/parts', partController.getParts);
router.get('/part/:id', partController.getOnePart);
router.put('/part/:id', partController.updatePart);
router.delete('/part/:id', partController.deletePart);

module.exports = router;