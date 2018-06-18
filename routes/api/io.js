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

const {getDbConfig,tag,pageCount,dbPath} = require('../config')

const store = getDbConfig().host;


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
    var data = JSON.stringify(json, null, 2);
    var hasDir = await fs.access(hostPath);
    if (hasDir) {
      await fs.mkdir(hostPath);
    }
    await Promise.all([fs.writeFile(filePath, data), this.updateStoreConfig('add', url, host, opt)])
    return {
      data: {
        url: url,
        host: host,
        data: json
      }
    }
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
    var data = JSON.stringify(json, null, 2);
    fs.writeFile(filePath, data);
    await this.updateStoreConfig('update', url, host, {url: newUrl});
    if (url !== newUrl) {
      this.rm(url, host, true);
    }
    return {
      data: {
        url: newUrl,
        host: host,
        data: json
      }
    }
  },
  async query(host, page){
    host = host || store;
    page = page || 0;
    var config = '';
    var configPath = path.join(dbPath, host, 'config.json');
    config = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(config);
    config = config.data.sort((a, b) => {
      return (b.weight + b.updateTime) - (a.weight + a.updateTime);
    });
    var start = pageCount * page;
    var result = config.slice(start, start + pageCount);
    result = await Promise.all(result.map(item => {
      return new Promise(function (reslove, reject) {
        fs.readFile(getUrlPath(item.url, host), 'utf8').then(json => {
          reslove({
            url: item.url,
            data: JSON.parse(json)
          })
        })
      })
    }));
    return {
      page: page,
      totalPage: Math.ceil(config.length/pageCount),
      data: result,
    };
  },
};