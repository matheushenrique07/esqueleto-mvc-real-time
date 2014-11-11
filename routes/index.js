var controllers  = require('../controllers/home');
var express = require('express');
var router  = express.Router();

router.get('/', controllers.home);
router.post('/users/create', controllers.users);
//router.post('/users/:user_id/tasks/create', controllers.create);

module.exports = router;