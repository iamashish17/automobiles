const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.get('/', protect, requireAdmin, ctrl.getAll);
router.patch('/:id/role', protect, requireAdmin, ctrl.updateRole);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
