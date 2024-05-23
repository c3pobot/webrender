'use strict'
const log = require('logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;


const PORT = process.env.PORT || 3000

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
require('./exchanges')
const ScreenShot = require('./screenShot');
const Cache = require('./cache')


const app = express()
const getKey = ()=>{
  try{
    let time = Date.now()
    return 'w-'+time
  }catch(e){
    log.error(e);
  }
}
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())

app.use('/css', express.static(`${baseDir}/css`))
app.use('/asset', express.static(`${baseDir}/public/data/asset`))
app.use('/portrait', express.static(`${baseDir}/public/data/portrait`))
app.use('/thumbnail', express.static(`${baseDir}/public/data/thumbnail`))

app.post('/web', (req, res)=>{
  handleWebRequest(req, res)
})
app.get('/puppeteer', (req, res)=>{
  handlePuppeteerRequest(req, res)
})
const handlePuppeteerRequest = async(req, res)=>{
  try{
    let html = Cache.get(req?.query?.key)
    if(html){
      res.status(200).send(html)
    }else{
      res.sendStatus(400)
    }
  }catch(e){
    log.error(e);
    res.sendStatus(400)
  }
}
const handleWebRequest = async(req, res)=>{
  try{
    let uri = 'http:/localhost:'+PORT+'/puppeteer'
    if(req?.body?.uri) uri = req.body.uri
    if(req?.body?.html){
      let pKey = req.body?.pKey
      if(!pKey) pKey = getKey()
      if(pKey) Cache.set(pKey, req.body.html)
      if(pKey) uri += '?key='+pKey
    }
    let img = await ScreenShot(uri, req?.body?.width, req?.body?.resizeImg)
    if(img){
      res.set('Content-Type', 'image/png')
      res.status(200).send(img)
    }else{
      res.status(400).json({status: 400, message: 'error getting image'})
    }
  }catch(e){
    log.error(e);
    res.send(400).json({message: 'Error occured'})
  }
}
const server = app.listen(PORT, ()=>{
  log.info(`web render server is listening on ${server.address().port}...`)
})
