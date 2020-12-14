/**
 * @功能名称:
 * @文件名称: api.js
 * @Date: 2020-03-04 15:28.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */

const baseDao = require('./baseDao');

class apiDao extends baseDao {
  constructor(model) {
    super(model);
  }

  async findAll(conditions) {
    var countTotal = await this.Model.countDocuments(conditions).exec();
    var jsonList = await this.Model.find(conditions).
        sort({weight: -1, updated: -1}).
        populate('userId','user').
        exec();
    return {countTotal,jsonList}
  }


  async findByPage(conditions, page = 1, count = 50) {
    var countTotal = await this.Model.countDocuments(conditions).exec();
    var jsonList =  await this.Model.find(conditions,{_id:0,__v:0}).
        skip((page - 1) * count).
        limit(count).
        sort({
          weight: -1,
          updated: -1,
        }).
        populate('userId',['user', 'proxy']).
        exec();
    return {totalPage: Math.ceil(countTotal/count), jsonList}
  }


  async search( userId, key, limitNums=10){
    var condition={
      userId: userId,
      url: {$regex:key,$options:"$i"}
    }
      return this.Model.find(condition,{_id:0,__v:0}).limit(limitNums).exec()
  }
  //
  // async findByPage(conditions,page,count){
  //     return super.findByPage(conditions,page,count)
  // }
  //
  // async updateOne(conditions, doc){
  //     return super.updateOne(conditions,doc)
  // }
  //
  // async deleteOne(conditions){
  //     return super.deleteOne(conditions)
  // }

}

module.exports = apiDao;
