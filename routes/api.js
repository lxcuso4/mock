/**
 * @功能名称:
 * @文件名称: api.js
 * @Date: 2020-03-18 15:06.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const express = require('express');
const router = express.Router();
const {add, rm, update, query,search} = require('../controllers/apis')


router.post('/add',add,err);
router.post('/rm',rm,err);
router.post('/update',update,err);
router.post('/query',query,err);
router.post('/search',search,err);

function err(req, res) {
  var msg = JSON.stringify(res.locals.err);
  res.json({code:-9,msg: msg || '文件操作错误',data:{}})
}
module.exports = router;
