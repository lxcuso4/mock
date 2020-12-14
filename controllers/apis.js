/**
 * @功能名称:
 * @文件名称: apis.js
 * @Date: 2020-03-18 11:39.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const {api} = require('../models')


async function add(req, res, next) {
  var doc = {
    userId: req.body.userId,
    url: req.body.url,
    data: req.body.data,
    weight: req.body.weight
  }
  var data = await api.create(doc).catch(err=>{
    res.locals.err = err
    next()
  })
  res.json({code:0,msg:'ok',data})
}
async function rm(req, res, next) {

  var condition = {
    url: req.body.url,
    userId: req.body.userId
  }
 var data = await api.deleteOne(condition).catch(err=>{
   res.locals.err = err
   next()
 })
  res.json({code:0,msg:'ok',data})
}

async function update(req, res, next) {
  var condition={
    userId: req.body.userId,
    url:req.body.url
  }
  var doc = {
    url: req.body.newUrl,
    data: req.body.data,
    weight: req.body.weight||0
  }

  var data = await api.updateOne(condition,doc).catch(err=>{
    res.locals.err = err
    next()
  })
  res.json({code:0,msg:'ok',data})
}
async function query(req, res, next) {

  var condition={
    userId: req.body.userId,
  }
  var data = await api.findByPage(condition, req.body.page, req.body.count).catch(err=>{
    res.locals.err = err
    next()
  })
  res.json({code:0,msg:'ok',data})
}
async function search(req, res, next){
  var data = await api.search(req.body.userId,  req.body.key, req.body.limitNums).catch(err=>{
    res.locals.err = err
    next()
  })
  res.json({code:0,msg:'ok',data})
}

module.exports = {
  add,rm,update,query,search
}
