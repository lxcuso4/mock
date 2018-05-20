/**
 * Created by liux on 2018/4/11.
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const log = console.log.bind(console);

http.createServer(app).listen(8084);

var ROOT = path.resolve('./db/default')

function app(req,res) {
  var pathname = url.parse(req.url).pathname;
  log(pathname)
  var filePath = pathname.replace(/\//g,'___')+'.json';
  filePath = path.join(ROOT, filePath)
  log(filePath)
  fs.readFile(filePath,'utf8',function (err, file) {
    if (err){
      res.writeHead(404);
      res.end('not found');
      return;
    }
    log(file)
    res.writeHead(200,{
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding':'chunked',
    });
    res.write(file,'utf8');
    res.end();
  })
}
