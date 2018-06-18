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

const {listen,close} = require('../../service')
const {dbPath,dbConfigPath,getDbConfig} = require('../config')
const store = getDbConfig().host;

module.exports = {
  async setStore(store){
    var config = getDbConfig();
    config = Object.assign(config, {store: store});
    await fs.writeFile(dbConfigPath, JSON.stringify(config, null, 2));
  },
  async addStore (store){
    var config = getDbConfig();
    var service = config.service;
    if(service.some(item=>{
      return item.host == store
    })){
      return {code:-1,msg:`${store}已存在`}
    }
    service.push({host:store});
    await fs.writeFile(dbConfigPath, JSON.stringify(config, null, 2));
    var hostPath = path.join(dbPath,store)
    var hasDir = await fs.access(hostPath);
    if (hasDir) {
      await fs.mkdir(hostPath);
    }
  },
  async startStore(store, port){
    listen(store,port).then(()=>{

    },()=>{

    })

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
