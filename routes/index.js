const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const api = require('./api.js');
const setting = require('./setting.js');
const mock = require('./mock');

router.use('/api',[bodyParser.json(),bodyParser.urlencoded({ extended: true }),api]);
router.use('/setting',[bodyParser.json(),bodyParser.urlencoded({ extended: true }),setting]);

router.use('/mock',[bodyParser.json(),bodyParser.urlencoded({ extended: true }),mock]);


module.exports = router;
