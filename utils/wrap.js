/**
 * Created by liux on 2018/4/15.
 */
'use strict';
const fs = require('fs');
var asyncFsItems = [
  {
    'name': 'access',
    'mode': 1,
  },
  {
    'name': 'appendFile',
    'mode': 1,
  },
  {
    'name': 'chmod',
    'mode': 1,
  },
  {
    'name': 'chown',
    'mode': 1,
  },
  {
    'name': 'close',
    'mode': 1,
  },
  {
    'name': 'copyFile',
    'mode': 1,
  },
  {
    'name': 'fchmod',
    'mode': 1,
  },
  {
    'name': 'fchown',
    'mode': 1,
  },
  {
    'name': 'fdatasync',
    'mode': 1,
  },
  {
    'name': 'fstat',
    'mode': 1,
  },
  {
    'name': 'fsync',
    'mode': 1,
  },
  {
    'name': 'ftruncate',
    'mode': 1,
  },
  {
    'name': 'futimes',
    'mode': 1,
  },
  {
    'name': 'lchmod',
    'mode': 1,
  },
  {
    'name': 'lchown',
    'mode': 1,
  },
  {
    'name': 'link',
    'mode': 1,
  },
  {
    'name': 'lstat',
    'mode': 1,
  },
  {
    'name': 'mkdir',
    'mode': 1,
  },
  {
    'name': 'mkdtemp',
    'mode': 1,
  },
  {
    'name': 'open',
    'mode': 1,
  },
  {
    'name': 'read',
    'mode': 1,
  },
  {
    'name': 'readdir',
    'mode': 1,
  },
  {
    'name': 'readFile',
    'mode': 1,
  },
  {
    'name': 'readlink',
    'mode': 1,
  },
  {
    'name': 'realpath',
    'mode': 1,
  },
  {
    'name': 'rename',
    'mode': 1,
  },
  {
    'name': 'rmdir',
    'mode': 1,
  },
  {
    'name': 'stat',
    'mode': 1,
  },
  {
    'name': 'symlink',
    'mode': 1,
  },
  {
    'name': 'truncate',
    'mode': 1,
  },
  {
    'name': 'unlink',
    'mode': 1,
  },
  {
    'name': 'utimes',
    'mode': 1,
  },
  {
    'name': 'write',
    'mode': 1,
  },
  {
    'name': 'writeFile',
    'mode': 1,
  }];

function Wrap(opt=[]) {
  if(opt && !Array.isArray(opt)){
    throw ('The parameter must be an array or an empty！')
  }
  asyncFsItems = asyncFsItems.concat(opt);
  asyncFsItems.forEach(item => {
    let name = item.name;
    let mode = item.mode || 2;
    if (typeof fs[name] !== 'function') {
      return;
    }
    this[name] = function(...arg) {
      return new Promise((resolve, reject) => {
        fs[name](...arg, function() {
          let re = Array.from(arguments);
          if(mode === 1){
            if(re[0]){
              reject(re[0])
            }else {
              re.shift();
              resolve(...re);
            }
          }else {
            resolve(...re)
          }
        });
      });
    };
  });
}
Wrap.prototype = fs;
module.exports = Wrap;
