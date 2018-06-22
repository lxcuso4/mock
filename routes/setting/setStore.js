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
const {dbPath, dbConfigPath, getDbConfig, writeDbConfig} = require('../config');
const store = getDbConfig().host;

const log = console.log.bind(console)

module.exports = {
  async addStore (store){
    var service = getDbConfig().service;
    if (service.some(item => {
          return item.host == store;
        })) {
      return {code: -1, msg: `${store}已存在`};
    }
    service.push({host: store});
    log(service)
    await writeDbConfig({service: service});
    var hostPath = path.join(dbPath, store);
    var hasDir = await fs.access(hostPath);
    if (hasDir) {
      await fs.mkdir(hostPath);
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
    if (service.some(item => {
          return item.host == store;
        })) {
      service = service.filter(item => {
        return item.host != store;
      });
      var storePath = path.join(dbPath, store);
      var hasDir = await fs.access(storePath);
      if (!hasDir) {
        await fs.rmdir(storePath);
      }
      await writeDbConfig({service: service});
      return {data:service}
    } else {
      return {code: -1, msg: `store:${store}不存在`};
    }
  },
  async reStore(store, newStore){
    var service = getDbConfig().service;
    var t1 = service.some(item => {
      return item.host == store;
    });
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
