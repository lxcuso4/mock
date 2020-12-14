

let mongoose = require('mongoose');
let {host,port,user,pwd,dataBase} = require('./config');

/**
 * debug 模式
 */
// mongoose.set('debug', true);

/**
 * 使用 Node 自带 Promise 代替 mongoose 的 Promise
 */
mongoose.Promise = global.Promise;


/**
 * 创建 Mongo 连接，内部维护了一个连接池，全局共享
 */

const options = {

    poolSize: 5, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
};

// let mongoClient = new Promise(function (resolve) {
//     setTimeout(resolve,1000)
// })

// let mongoClient = mongoose.createConnection('mongodb://localhost:27017/test',options);
// authSource 身份认证所用库，云数据库 MongoDB 固定为 admin
  mongoose.connect(`mongodb://${user}:${pwd}@${host}:${port}/${dataBase}?authSource=admin`,options)
let mongoClient = mongoose.connection;
/**
 * Mongo 连接成功回调
 */
mongoClient.on('connected', function () {

    console.log('Mongoose connected  success' );
});
/**
 * Mongo 连接失败回调
 */
mongoClient.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
/**
 * Mongo 关闭连接回调
 */
mongoClient.on('disconnected', function () {
    console.log('Mongoose disconnected');
});


/**
 * 关闭 Mongo 连接
 */
function close() {
    mongoClient.close();
}


module.exports = {
    mongoClient,
    close,
};
