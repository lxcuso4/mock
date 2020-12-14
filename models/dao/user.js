/**
 * @项目名称: mock
 * @功能名称:
 * @文件名称: user
 * @Date: 2020/3/13
 * @Author: liux
 *
 */

const baseDao = require('./baseDao')

class userDao extends baseDao {
    constructor(model){
        super(model)
    }
}

module.exports =  userDao
