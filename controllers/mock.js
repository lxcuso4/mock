/**
 * @功能名称:
 * @文件名称: mock.js
 * @Date: 2020-03-18 15:19.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */
const queryString = require('query-string')
const {user, api} = require('../models')

module.exports = async function (req, res, next) {
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS')
    res.header('Cache-Control','no-store');
    res.header('Access-Control-Allow-Headers',
      'Origin, Content-Type,Content-Length, Authorization, Accept,Accept-Encoding,Accept-Language, X-Requested-With,Keep-Alive,If-Modified-Since,Cache-Control')
    if (req.method == 'OPTIONS') {
      return res.sendStatus(200)
    }
  }
  const paramsObject = queryString.parseUrl(req.url)
  const userName = paramsObject.url.split('/')[1]
  const url = paramsObject.url.replace(/^\/[^/]+/, '')
  const mergejson = req.body.json
  try {
    var data = null
    const {userDoc, apiDoc} = await getDoc(userName, url)
    if (apiDoc) {
      data = JSON.parse(apiDoc.data)
    } else {
      data = await getProxyDoc(userDoc, url)
    }

    if (data) {
      return res.json(Object.assign(data, mergejson))
    } else {
      return res.sendStatus(404)
    }
  } catch (e) {
    res.locals.err = e
    next()
  }
}

async function getDoc (userName, url) {
  var userDoc = await user.findOne({user: userName})
  var apiDoc = await api.findOne({userId: userDoc.id, url})
  return {userDoc, apiDoc}
}

async function getProxyDoc (_userDoc, url) {
  var {host, port, cache, start} = _userDoc.proxy
  if (!start || !host) return
  var {apiDoc} = await getDoc(host, url)
  if (!apiDoc) {
    return
  }
  if(cache){
    try {
      var doc = {
        userId: _userDoc.id,
        url: url,
        data: apiDoc.data
      }
      await api.create(doc)
    }catch (e) {

    }
  }
  return JSON.parse(apiDoc.data)
}
