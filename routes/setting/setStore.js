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

const {listen, close} = require('../../service');
const {dbPath, test, getDbConfig, writeDbConfig, copyDir,rmdir} = require('../config');
const store = getDbConfig().host;

const log = console.log.bind(console)



module.exports = {
  async addStore (store,fromStore){
    var service = getDbConfig().service;
    if (test(store)) {
      return {code: -1, msg: `${store}已存在`};
    }
    if(fromStore && !test(fromStore)){
        return {code: -1, msg: `${fromStore}不存在`};
    }
    service.push({host: store});
    await writeDbConfig({service: service});
    var hostPath = path.join(dbPath, store);
    await fs.mkdir(hostPath);
    if (fromStore) {
      var sourcePath = path.join(dbPath,fromStore)
      await copyDir(sourcePath, hostPath);
    }
    return {data:service}
  },
  async listenStore(store, port){
    var re = await listen(store, port);
    if(re.code == 0){
      var service = getDbConfig().service;
      service.forEach(item=>{
        if(item.host == store){
          item.port = port;
          item.state = 1;
        }
      })
      await writeDbConfig({service:service})
      return {data:service}
    }else {
      return re
    }
  },
  async closeStore(port){
    var re = await close(port);
    if(re.code == 0){
      var service = getDbConfig().service;
      service.forEach(item=>{
        if(item.port == port){
          item.state = 0
        }
      })
      await writeDbConfig({service:service})
      return {data: service}
    }else {
      return re
    }
  },
  async queryStore(){
    var service = getDbConfig().service;
    return {data: service};
  },
  async rmStore(store){
    var service = getDbConfig().service;
    if (test(store)) {
      service = service.filter(item => {
        return item.host != store;
      });
      await writeDbConfig({service: service});
      var storePath = path.join(dbPath, store);
      await rmdir(storePath);
      return {data:service}
    } else {
      return {code: -1, msg: `store:${store}不存在`};
    }
  },
  async reStore(store, newStore){
    var service = getDbConfig().service;
    var t1 = test(store)
    var t2 = service.every(item => {
      return item.host != newStore;
    });
    if (!t1) {
      return {code: -1, msg: `store:${store}不存在`};
    }
    if (!t2) {
      return {code: -1, msg: `newStore:${newStore}已存在`};
    }
    service = service.map(item => {
      if (item.host == store) {
        item.host = newStore;
      }
      return item;
    });
    await writeDbConfig({service: service});
    var storePath = path.join(dbPath, store);
    var newStorePath = path.join(dbPath, newStore);
    await fs.rename(storePath, newStorePath);
    return {data:service}
  },
};
