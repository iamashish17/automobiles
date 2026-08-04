const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
 
router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/clerk/session', protect, ctrl.clerkSession);
router.get('/me', protect, ctrl.me);
module.exports = router;
