/**
 * @项目名称: mock
 * @功能名称:
 * @文件名称: index
 * @Date: 2020/2/28
 * @Author: liux
 *
 */

const {mongoClient} = require('./mongo')

const apiModel = require('./model/api')
const userModel = require('./model/user')

const apiDao = require('./dao/api')
const userDao = require('./dao/user')

const api = new apiDao(apiModel)
const user = new userDao(userModel)


module.exports = {api, user, mongoClient}
