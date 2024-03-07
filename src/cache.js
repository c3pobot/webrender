'use strict'
const log = require('logger')
const Cache = require('node-cache')
const HTMLCache = new Cache({stdTTL: 60, checkperiod: 60})
module.exports.set = async(key, value)=>{
  try{
    if(key) await HTMLCache.set(key, value)
  }catch(e){
    log.error(e);
  }
}
module.exports.get = async(key)=>{
  try{
    if(key) return await HTMLCache.take(key)
  }catch(e){
    log.error(e);
  }
}
