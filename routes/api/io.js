/**
 * Created by liux on 2018/4/15.
 * @param Object
 * {
 * host: 'default',
 * url: '/h5/commom/get_config'
 * data: {something: xxx}
 * }
 *
 */
const Fs = require('aw-fs');
const path = require('path');
var fs = new Fs([{name: 'access', module: 2}]);

const dbPath = path.resolve(__dirname, '../../db');
const dbConfigPath = path.join(dbPath, 'config.json');
const tag = '___';
const pageCount = 10;
const store = getDbConfig().host;

function getDbConfig() {
  var hasConfig =  fs.existsSync(dbConfigPath);
  if(!hasConfig){
    var config = {
      host:'default'
    }
    fs.writeFile(dbConfigPath,JSON.stringify(config,null,2))
    return config;
  }
  var config =  fs.readFileSync(dbConfigPath, 'utf8');
  return JSON.parse(config);
}

function getUrlPath(url, host) {
  url = url.trim();
  url = url.replace(/\//g, tag);
  url = url + '.json';
  return path.resolve(dbPath, host, url);
}

module.exports = {
  async updateStoreConfig(type, url, host, opt){
    opt = Object.assign({weight: 0}, opt);
    var configPath = path.join(dbPath, host, 'config.json');
    var config = {data: []};
    var err = await fs.access(configPath);
    if (!err) {
      var jsonData = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(jsonData);
    }
    var data = config.data;
    opt.updateTime = Date.now();
    switch (type) {
      case 'add':
        opt = Object.assign({url: url}, opt);
        data.push(opt);
        break;
      case 'update':
        data = data.map(item => {
          if (item.url === url) {
            Object.assign(item, opt);
          }
          return item;
        });
        break;
      case 'rm':
        data = data.filter(item => {
          if (item.url === url) {
            return false;
          }
          return true;
        });
        break;
      default:
        break;
    }
    config.data = data;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  },
  async add(url, json, host, opt){
    host = host || store;
    var filePath = getUrlPath(url, host);
    var hasFile = await fs.access(filePath);
    if (!hasFile) {
      return {code: -1, msg: `url:${url}已存在`};
    }
    var hostPath = path.resolve(dbPath, host);
    var json = JSON.stringify(json);
    var hasDir = await fs.access(hostPath);
    if (hasDir) {
      await fs.mkdir(hostPath);
    }
    await Promise.all([fs.writeFile(filePath, json),this.updateStoreConfig('add', url, host, opt)])
  },
  async rm(url, host, rmconfig){
    host = host || store;
    var filePath = getUrlPath(url, host);
    var err = await fs.access(filePath);
    if (!err) {
      if (!rmconfig) {
        this.updateStoreConfig('rm', url, host);
      }
      await fs.unlink(filePath);
    }
  },
  async update(url, json, host, newUrl){
    host = host || store;
    var filePath = getUrlPath(newUrl, host);
    var hasFile = await fs.access(filePath);
    if (!hasFile) {
      return {code: -1, msg: `newUrl:${newUrl}已存在`};
    }
    var json = JSON.stringify(json);
    fs.writeFile(filePath, json);
    await this.updateStoreConfig('update', url, host, {url: newUrl});
    if (url !== newUrl) {
      this.rm(url, host, true);
    }
  },
  async query(host, page){
    host = host || store;
    page = page || 0;
    var config = this.query[host];
    if (!config) {
      var configPath = path.join(dbPath, host, 'config.json');
      config = await fs.readFile(configPath, 'utf8');
      config = JSON.parse(config);
      this.query[host] = config = config.data.sort((a, b) => {
        return (b.weight + b.updateTime) - (a.weight + a.updateTime);
      });
    }
    var start = pageCount * page;
    var result = config.slice(start, start + pageCount);
    if (result.length === 0)return result;
    result = await Promise.all(result.map(item => {
      return fs.readFile(getUrlPath(item.url, host), 'utf8');
    }));
    return result.map(item => {
      return JSON.parse(item);
    });
  },
  async setStore(store){
    var config = getDbConfig();
    config = Object.assign(config, {store: store});
    await fs.writeFile(dbConfigPath,JSON.stringify(config, null, 2));
  },
  async rmStore(store){
    var storePath = path.join(dbPath, store);
    await fs.rmdir(storePath);
  },
  async reStore(store, newStore){
    var storePath = path.join(dbPath, store);
    var newStorePath = path.join(dbPath, newStore);
    var re = await Promise.all([fs.access(storePath),fs.access(newStorePath)])
    if(re[0]){
      return {code:-1,msg:`store:${store}不存在`}
    }
    if(!re[1]){
      return {code:-1,msg:`store:${newStore}已存在`}
    }
    await fs.rename(storePath, newStorePath);
  },
};