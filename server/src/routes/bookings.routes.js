const router = require('express').Router();
const ctrl = require('../controllers/bookings.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.post('/', protect, ctrl.create);
router.get('/me', protect, ctrl.myBookings);
router.get('/', protect, requireAdmin, ctrl.allBookings);
router.patch('/:id/status', protect, requireAdmin, ctrl.updateStatus);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
