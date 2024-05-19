'use strict'
const log = require('logger')
const fs = require('fs')
module.exports = (data = {})=>{
  try{
    if(typeof msg2send != 'object' && typeof msg2send == 'string') data = JSON.parse(data)
    if(!data.dir || !data.fileName || !data.file) return
    log.debug(`recieved new image ${data.dir}/${data.fileName}`)
    if(!fs.existsSync(`/app/public/${data.dir}`)) fs.mkdirSync(`/app/public/${data.dir}`, { recursive: true })
    let buff = Buffer.from(data.file, 'base64')
    fs.writeFileSync(`/app/public/${data.dir}/${data.fileName}`, buff)
  }catch(e){
    log.error(e)
  }
}
