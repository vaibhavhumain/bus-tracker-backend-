const express = require('express');
const {createBusOrder , getBusOrderById , getAllBusOrders , updateProgressStage , addProgressLog} = require('../controllers/busController');

const router = express.Router();

router.post('/create',createBusOrder);
router.post('/:id/log',addProgressLog);
router.get('/all',getAllBusOrders);
router.get('/:id',getBusOrderById);

router.put('/:id/progress',updateProgressStage);

module.exports = router;