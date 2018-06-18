/**
 * @功能名称:
 * @文件名称: index.js
 * @Date: 2018/6/18 下午5:10.
 * @Author: liux
 * @Copyright（C）: 2014-2018 X-Financial Inc.   All rights reserved.
 */


const fs = require('fs');
const path = require('path');
const {listen} = require('./service');
const dbPath = path.resolve(__dirname, '../db');
const dbConfigPath = path.join(dbPath, 'config.json');

function getDbConfig() {
  var hasConfig = fs.existsSync(dbConfigPath);
  if (!hasConfig) {
    return {};
  }
  var config = fs.readFileSync(dbConfigPath, 'utf8');
  return JSON.parse(config);
}

function init() {
  var service = getDbConfig().service;
  if (service && Array.isArray(service)) {
    service.forEach(item => {
      if (item.host && item.port && item.status == 1) {
        listen(item.port, item.host);
      }
    });
  }
}



module.exports = {init,}