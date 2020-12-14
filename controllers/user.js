/**
 * @功能名称:
 * @文件名称: setting.js
 * @Date: 2020-03-18 11:40.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const {user, api} = require('../models')

async function addUser (req, res, next) {
  var doc = {
    user: req.body.user,
    proxy: req.body.proxy,
  }

  var newUser = await user.create(doc).catch(err => {
    res.locals.err = err
    next()
  })
  try {
    var forkUser = req.body.forkUser;
    if (forkUser) {
      var forkUserDoc = await user.findOne({user: forkUser})
      var forkDataList = await api.find({userId: forkUserDoc.id}, {url: 1, weight: 1, data: 1})

      forkDataList = forkDataList.map(item => {
        let doc =item.toJSON();
        doc.userId = newUser.id
        return doc
      })

      await api.create(...forkDataList)
    }
  } catch (e) {
    res.locals.err = e
  }
  res.json({code: 0, msg: 'ok', newUser})
}

async function queryUser (req, res, next) {
  var data = await user.find({},{__v:0}).catch(err => {
    res.locals.err = err
    next()
  })
  res.json({code: 0, msg: 'ok', data})
}

async function rmUser (req, res, next) {
  var condition = {
    user: req.body.user,
  }
  // if(condition.user === 'default'){
  //   res.locals.err = '默认仓库不能删除'
  //   next()
  // }
  try {
    var data = await user.findOne(condition)
    await api.deleteMany({userId: data.id})
    await user.deleteMany(condition)
  } catch (e) {
    res.locals.err = e
    next()
  }
  res.json({code: 0, msg: 'ok', data})
}

async function updateUser (req, res, next) {
  var condition = {
    user: req.body.user,
  }
  var doc = {
    user: req.body.newUser,
    proxy: req.body.proxy,
  }
  var data = user.updateOne(condition, doc).catch(err => {
    res.locals.err = err
    next()
  })
  res.json({code: 0, msg: 'ok', data})
}


module.exports = {
  addUser,
  queryUser,
  rmUser,
  updateUser,
}
