const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/active/:tableNo', billController.getActiveOrder);
router.get('/open', billController.getOpenOrders);
router.post('/save', billController.saveOrder);
router.post('/generate/:id', billController.generateBill);
router.post('/settle/:id', billController.settleBill);
router.get('/', billController.getBills);
router.delete('/:id', billController.deleteBill);

module.exports = router;
