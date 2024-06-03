'use strict'
const log = require('logger')
const fs = require('fs')

module.exports = async(data = {})=>{
  try{
    if(typeof msg2send != 'object' && typeof msg2send == 'string') data = JSON.parse(data)
    if(!data.dir || !data.fileName || !data.key || !data.base64Img) return
    log.debug(`recieved new image ${data.dir}/${data.fileName}`)
    if(!fs.existsSync(`/app/public/data/${data.dir}`)) fs.mkdirSync(`/app/public/data/${data.dir}`, { recursive: true })
    let buff = Buffer.from(data.base64Img, 'base64')
    fs.writeFileSync(`/app/public/data/${data.dir}/${data.fileName}`, buff)
    log.info(`saved new image ${data.dir}/${data.fileName}`)
  }catch(e){
    log.error(e)
  }
}
