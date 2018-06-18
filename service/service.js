/**
 * Created by liux on 2018/4/11.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const db = path.resolve(__dirname,'../db');

var serverList = {};

function listen(store, port) {
  if(serverList[port]){
    return Promise.resolve({code:0,msg:`${port} 已经开启`})
  }
  var ROOT = path.join(db, store);
  var server = http.createServer(app);
  return new Promise(function(reslove, reject) {
    server.on('error', (e) => {
      reject({code: -1, msg: e.toString()});
    }).on('listening', (e) => {
      reslove({code: 0, msg: e});
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

function close(port) {
  return new Promise(function(reslove, reject) {
    if (!serverList[port]) {
      reject({code: 0, msg: `${port} 端口未启用`});
    }
    serverList[port].on('error', (e) => {
      reject({code: -1, msg: e.toString()});
    });
    serverList[port].close(function() {
      reslove({code: 0, msg: ` ${port} 已关闭`});
    });
  });

}
module.exports = {listen, close};
