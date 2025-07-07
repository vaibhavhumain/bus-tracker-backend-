const express = require('express');
const {createBusOrder , getBusOrderById , getAllBusOrders , updateProgressStage , addProgressLog , uploadBusMedia , deleteBusOrder , generateAndSaveBusPdf} = require('../controllers/busController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create',auth,createBusOrder);
router.post('/:id/log',auth,addProgressLog);
router.post('/:id/media',auth,uploadBusMedia);
router.post('/:id/generate-pdf',auth ,generateAndSaveBusPdf);


router.get('/all',auth,getAllBusOrders);
router.get('/:id',auth,getBusOrderById);
router.get('/download-pdf/:id', auth, busController.downloadBusPdf);

router.put('/:id/progress',auth,updateProgressStage);

router.delete('/:id', auth, deleteBusOrder);

module.exports = router;