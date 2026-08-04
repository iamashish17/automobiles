const router = require('express').Router();
const ctrl = require('../controllers/reviews.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.get('/approved', ctrl.getApproved);
router.post('/', protect, ctrl.submit);
router.get('/admin', protect, requireAdmin, ctrl.getAll);
router.patch('/:id/approve', protect, requireAdmin, ctrl.approve);
router.patch('/:id/reject', protect, requireAdmin, ctrl.reject);

module.exports = router;
