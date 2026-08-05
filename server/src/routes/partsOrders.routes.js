const router = require('express').Router();
const ctrl = require('../controllers/partsOrders.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.post('/', protect, ctrl.create);
router.post('/khalti/verify', protect, ctrl.verifyKhaltiPayment);
router.get('/me', protect, ctrl.myOrders);
router.get('/', protect, requireAdmin, ctrl.allOrders);
router.patch('/:id/status', protect, requireAdmin, ctrl.updateStatus);

module.exports = router;
