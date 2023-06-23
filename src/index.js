'use strict'
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const ScreenShot = require('./screenShot');
const Cache = require('./cache')
const PORT = process.env.PORT || 3000
let baseDir
const getKey = ()=>{
  try{
    let time = Date.now()
    return 'w-'+time
  }catch(e){
    console.error(e);
  }
}
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())

app.post('/web', async(req, res)=>{
  try{
    let uri = 'http:/localhost:'+PORT+'/puppeteer', body = {}, method = 'GET', headers = {'Content-Type': 'application/json'}
    if(req?.body?.uri) uri = req.body.uri
    if(req?.body?.html){
      let pKey = req?.body?.pKey
      if(!pKey) pKey = await getKey()
      if(pKey) await Cache.set(pKey, req.body.html)
      if(pKey) uri += '?key='+pKey
    }
    const img = await ScreenShot(uri, req?.body?.width, req?.body?.resizeImg)
    if(img){
      res.send(img)
    }else{
      res.json({status: 500, message: 'error getting image'}).status(500)
    }
  }catch(e){
    console.error(e);
    res.send(500)
  }
})
app.get('/puppeteer', async(req, res)=>{
  try{
    let html = await Cache.get(req?.query?.key)
    if(html){
      res.send(html)
    }else{
      res.json({status: 400, message: 'no html provided'}).status(400)
    }
  }catch(e){
    console.error(e);
    res.status(500)
  }
})
const StartServer = (dir)=>{
  try{
    baseDir = dir || '/app'
    app.use('/thumbnail', express.static(path.join(baseDir, 'thumbnail')))
    app.use('/asset', express.static(path.join(baseDir, 'asset')))
    app.use('/css', express.static(path.join(baseDir, 'css')))
    app.use('/portrait', express.static(path.join(baseDir, 'portrait')))
    app.listen(PORT, ()=>{
      console.log('WebRender Server Listening on ', server.address().port)
    })
  }catch(e){
    console.error(e);
  }
}
module.exports = StartServer()
