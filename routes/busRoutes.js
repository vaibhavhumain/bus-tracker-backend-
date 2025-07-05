const express = require('express');
const {createBusOrder , getBusOrderById , getAllBusOrders , updateProgressStage , addProgressLog , uploadBusMedia , deleteBusOrder} = require('../controllers/busController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create',auth,createBusOrder);
router.post('/:id/log',auth,addProgressLog);
router.post('/:id/media',auth,uploadBusMedia);

router.get('/all',auth,getAllBusOrders);
router.get('/:id',auth,getBusOrderById);

router.put('/:id/progress',auth,updateProgressStage);

router.delete('/:id', auth, deleteBusOrder);

module.exports = router;