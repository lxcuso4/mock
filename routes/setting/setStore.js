/**
 * @功能名称:
 * @文件名称: setStore.js
 * @Date: 2018/6/18 下午7:15.
 * @Author: liux
 * @Copyright（C）: 2014-2018 X-Financial Inc.   All rights reserved.
 */

const Fs = require('aw-fs');
const path = require('path');
var fs = new Fs([{name: 'access', module: 2}]);

const {dbPath,dbConfigPath,getDbConfig} = require('../config')

const store = getDbConfig().host;
module.exports = {

  async setStore(store){
    var config = getDbConfig();
    config = Object.assign(config, {store: store});
    await fs.writeFile(dbConfigPath, JSON.stringify(config, null, 2));
  },
  async addStore (){

  },
  async startStore(){

  },
  async queryStore(){

  },
  async rmStore(store){
    var storePath = path.join(dbPath, store);
    await fs.rmdir(storePath);
  },
  async reStore(store, newStore){
    var storePath = path.join(dbPath, store);
    var newStorePath = path.join(dbPath, newStore);
    var re = await Promise.all([fs.access(storePath), fs.access(newStorePath)]);
    if (re[0]) {
      return {code: -1, msg: `store:${store}不存在`};
    }
    if (!re[1]) {
      return {code: -1, msg: `store:${newStore}已存在`};
    }
    await fs.rename(storePath, newStorePath);
  },
};
