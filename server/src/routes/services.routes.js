const router = require('express').Router();
const ctrl = require('../controllers/services.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.get('/', ctrl.getAll);
router.post('/', protect, requireAdmin, ctrl.create);
router.put('/:id', protect, requireAdmin, ctrl.update);
router.delete('/:id', protect, requireAdmin, ctrl.remove);

module.exports = router;
