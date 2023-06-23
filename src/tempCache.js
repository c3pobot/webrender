'use strict'
const cache = {}
module.exports.set = (key, value)=>{
  try{
    if(key) cache[key] = value
  }catch(e){
    console.error(e);
  }
}
module.exports.get = (key)=>{
  try{
    if(!key) return;
    let res = cache[key]
    delete cache[key]
    return res
  }catch(e){
    console.error(e);
  }
}
