/**
 * @功能名称:
 * @文件名称: test.js.js
 * @Date: 2018/6/18 上午10:41.
 * @Author: liux
 * @Copyright（C）: 2014-2018 X-Financial Inc.   All rights reserved.
 */
var  {listen,close} = require('./service/service')
listen(8084,'default');
// listen(8084,'default');
setTimeout(function() {
  // listen(8084,'default');
  // close(8084);
},5000)
