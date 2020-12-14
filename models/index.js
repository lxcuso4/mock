/**
 * @项目名称: mock
 * @功能名称:
 * @文件名称: index
 * @Date: 2020/2/28
 * @Author: liux
 *
 */

const {mongoClient, close} = require('./mongo')

const apiModel = require('./model/api')
const userModel = require('./model/user')

const apiDao = require('./dao/api')
const userDao = require('./dao/user')

const api = new apiDao(apiModel)
const user = new userDao(userModel)

const log = console.log.bind(console)

module.exports = {api, user, mongoClient}

var a = {
    "url": "/h5/common/get_baseInfo121",
    "weight": 0,
    "data": JSON.stringify({
        "errcode": 0,
        "errstr": "ok",
        "data": {}
    })
}
var b = {
    "url": "/h5/taobao/login_submit141",
    "weight": undefined,
    "data": JSON.stringify({
        "errcode": 0,
        "errstr": "ok",
        "data": {}
    })
}

var  c = {
    user:'cardloan',
    proxy:{
        host:'bbb'
    }
}
var  d = {
    user:'wallet',
    proxy:{
        host:'eee'
    }
}
 // mongoClient.then(init)
async  function init() {

    // var doc = await api.create(a,b).then(log,log)
    // api.find({user:'wallet'}).then(log,log)
    // api.findOne({user:'wallet',url:'/h5/taobao/login_submit'}).then(log,log)
    //  api.findByPage({user:'wallet'},2,2).then(log,log)
    //  api.updateOne({user:'wallet',url:'/h5/common/get_baseInfo8'},a).then(log,log)
    //  api.deleteOne({user:'wallet',url:'/h5/common/get_baseInfo9'}).then(log,log)
    // api.Model.find({user:'wallet'}).exec().then(log,log)
    // api.Model.find({user:'wallet'}).populate('parent').exec().then(log,log)

  // user.create({}).then(log,log)
  //   await user.deleteOne({user:'cardloan'}).then(log,log)
  //    user.find().then(log,log)

  //   user.updateOne({user:'cardloan'},c).then(log,log)
  //  await user.find().then(log,log)
    var data = await user.findOne({user:'wallet'})
  //   a.userId = data._id;
  //   b.userId = data._id;
  //   var doc = await api.create(a,b).then(log,log)

    var list = await api.find({userId: data.id},{url:1,data:1,weight:1})

     var result = list.map(item=>{
         let o1 = item.toJSON()
        let o2 = item.toObject()
         o1.id = 123
         return o1
     })
  log(result)
    // api.findByPage({userId:data._id},1,3).then(log,log)
}
