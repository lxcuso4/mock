/**
 * @功能名称: 全局工具函数
 * @文件名称: utils.js
 * @Date: 2018/6/18 下午7:19.
 * @Author: liux
 * @Copyright（C）: 2014-2018 X-Financial Inc.   All rights reserved.
 */
const Fs = require('aw-fs');
const path = require('path');
var fs = new Fs([{name: 'access', module: 2}]);
const dbPath = path.resolve(__dirname, '../db');
const dbConfigPath = path.join(dbPath, 'config.json');

module.exports = {
  dbPath: dbPath,
  dbConfigPath: dbConfigPath,
  tag:'___',
  pageCount:100,
  getDbConfig() {
    var hasConfig = fs.existsSync(dbConfigPath);
    if (!hasConfig) {
      var config = {
        host: 'default',
        service: [
          {
            'host': 'default',
            'port': 8084,
            'status': 1,
          }],
      };
      fs.writeFile(dbConfigPath, JSON.stringify(config, null, 2));
      return config;
    }
    var config = fs.readFileSync(dbConfigPath, 'utf8');
    return JSON.parse(config);
  },
};