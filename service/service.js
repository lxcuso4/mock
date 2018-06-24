/**
 * Created by liux on 2018/4/11.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const db = path.resolve(__dirname,'../db');

var serverList = {};

async function listen(store, port) {
  if(serverList[port]){
    return Promise.resolve({code:-1,msg:`${port} 已被占用`})
  }
  var ROOT = path.join(db, store);
  var server = http.createServer(app);
  return new Promise(function(resolve, reject) {
    server.on('error', (e) => {
      resolve({code: -1, msg: e.toString()});
    })
    server.on('listening', (e) => {
      resolve({code: 0, msg: '已开启'});
    });
    serverList[port] = server.listen(port);
  });
  function app(req, res) {
    var pathname = url.parse(req.url).pathname;
    var filePath = pathname.replace(/\//g, '___');
    filePath = filePath.replace(/(.json)?$/, '.json');
    filePath = path.join(ROOT, filePath);
    fs.readFile(filePath, 'utf8', function(err, file) {
      if (err) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Transfer-Encoding': 'chunked',
      });
      res.write(file, 'utf8');
      res.end();
    });
  }

}

async function close(port) {
  if (!serverList[port]) {
    return Promise.resolve({code: -1, msg: `${port} 端口未启用`})
  }
  return new Promise(function(resolve, reject) {
    serverList[port].on('error', (e) => {
      resolve({code: -1, msg: e.toString()});
    });
    serverList[port].close(function() {
      delete serverList[port]
      resolve({code: 0, msg: ` ${port} 已关闭`});
    });
  });

}
module.exports = {listen, close};
