const router = require('express').Router();
const ctrl = require('../controllers/parts.controller');
const protect = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

router.get('/', ctrl.getAll); // public
router.get('/:id', ctrl.getOne); // public
router.post('/', protect, requireAdmin, ctrl.create); // admin only
router.put('/:id', protect, requireAdmin, ctrl.update); // admin only
router.delete('/:id', protect, requireAdmin, ctrl.remove); // admin only

module.exports = router;
