/**
 * @功能名称:
 * @文件名称: api.js
 * @Date: 2020-03-18 15:06.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const express = require('express');
const router = express.Router();
const {addUser, queryUser, rmUser, updateUser,} = require('../controllers/user');

router.post('/addStore',addUser,err)
router.post('/queryStore',queryUser,err)
router.post('/updateStore',updateUser,err);
router.post('/rmStore',rmUser,err);

function err(req, res) {
  var msg = JSON.stringify(res.locals.err);
  res.json({code: -8, msg: msg || '文件操作错误', data: {}});
}

module.exports = router;
