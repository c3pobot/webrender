'use strict'
const log = require('logger')
//const Cache = require('node-cache')
//const HTMLCache = new Cache({stdTTL: 60, checkperiod: 60})
let cache = new Map(), stdTTL = 60000
module.exports.set = (key, value)=>{
  if(key){
    cache.set(key, value)
    setTimeout(()=>cache.delete(key), stdTTL)
  }
}
module.exports.get = (key)=>{
  let value = cache.get(key)
  cache.delete(key)
  return value
}
