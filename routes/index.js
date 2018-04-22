const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const api = require('./api/index');
const home = require('./users');


router.use('/api',[bodyParser.json(),bodyParser.urlencoded({ extended: false }),api]);
router.use(home);


module.exports = router;
