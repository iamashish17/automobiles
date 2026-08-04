const router = require('express').Router();
const ctrl = require('../controllers/contact.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.post('/', ctrl.submit);
router.get('/', protect, requireAdmin, ctrl.getAll);
router.patch('/:id/read', protect, requireAdmin, ctrl.markRead);
router.patch('/:id/unread', protect, requireAdmin, ctrl.markUnread);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
