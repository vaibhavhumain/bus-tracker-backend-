const express = require('express');
const {createBusOrder} = require('../controllers/busController');

const router = express.Router();

router.post('/create',createBusOrder);

module.exports = router;