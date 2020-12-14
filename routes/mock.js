/**
 * @功能名称:
 * @文件名称: api.js
 * @Date: 2020-03-18 15:06.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const express = require('express');
const router = express.Router();
const mock = require('../controllers/mock');

router.all('/**',mock, err)
function err(req, res, next) {
  res.status(404);
  res.json({err: res.locals.err.message,msg:'接口未定义'})
}
module.exports = router;
