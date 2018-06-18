/**
 * @功能名称:
 * @文件名称: index.js.js
 * @Date: 2018/6/18 下午7:15.
 * @Author: liux
 * @Copyright（C）: 2014-2018 X-Financial Inc.   All rights reserved.
 */

const express = require('express');
const router = express.Router();
const set = require('./setStore')

router.post('/setStore',setStore,err);
router.post('/reStore',reStore,err);
router.post('/rmStore',rmStore,err);

function setStore(req, res, next) {
  var {store}=test('store',...arguments);
  set.setStore(store).then(json=>{
    res.json(Object.assign({code:0,msg:'ok'},json))
  },err=>{
    res.locals.err = err
    next()
  })
}
function rmStore(req, res, next) {
  var {store}=test('store',...arguments)
  set.rmStore(store).then(json=>{
    res.json(Object.assign({code:0,msg:'ok'},json))
  },err=>{
    res.locals.err = err
    next()
  })
}
function reStore(req, res,next) {
  var {store,newStore}=test('reStore',...arguments);
  set.reStore(store,newStore).then(json=>{
    res.json(Object.assign({code:0,msg:'ok'},json))
  },err=>{
    res.locals.err = err
    next()
  })
}

function test(type,req,res,next) {
  var rule = {
    store(value){
      return value && /^[^\/\s]+$/g.test(value)
    },
    newStore(value){
      return value && /^[^\/\s]+$/g.test(value)
    },
    json(value){
      return value && typeof value === 'object'
    },
    page(value){
      return !value || /^\d+$/g.test(value)
    },
    opt(value){
      return !value.weight || /^\d+$/g.test(value.weight)
    },
  }
  var re = {
    host: req.body.host,
    url: req.body.url
  }
  switch (type){
    case 'add':
      re.json = req.body.data;
      if(req.body.weight){
        re.opt = {weight: req.body.weight};
      }
      break;
    case 'update':
      re.json = req.body.data;
      re.newUrl = req.body.newUrl||re.url;
      break;
    case 'query':
      re.page = req.body.page;
      delete re.url;
      break;
    case 'store':
      re.store = req.body.store;
      delete re.url;
      delete re.host;
      break;
    case 'reStore':
      re.store = req.body.store;
      re.newStore = req.body.newStore
      delete re.url
      delete re.host
      break;
  }
  for(let key in re){
    if(!rule[key](re[key])){
      res.json({code:-1,msg:'参数格式错误'})
      return next()
    }
  }
  return re;
}

function err(req, res) {
  var msg = JSON.stringify(res.locals.err);
  res.json({code:-9,msg: msg || '文件操作错误',data:{}})
}
module.exports = router;