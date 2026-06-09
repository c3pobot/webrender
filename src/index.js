import log from './logger.js'

import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import { MongoCacheShared } from 'mongo-cache'
import getAccentSwatchImg from './get_accent_swatch_img.js'

import screenShot from './screen_shot.js'
import cache from './cache.js'

const PORT = process.env.PORT || 3000
const baseDir = process.env.BASE_DIR || '/app'
const NAME_SPACE = process.env.NAME_SPACE || 'default'

const app = express()
MongoCacheShared.connect('mongodb://mongo-data-rs2.datastore.svc.cluster.local?replicaSet=rs2&ssl=false&compressors=snappy&retryReads=true&retryWrites=true')

export const testCache = new MongoCacheShared.client({
   db_name: `test_cache_${NAME_SPACE}`
})
export const dataCache = new MongoCacheShared.client({
  db_name: 'game_data'
})
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
import getHtml from '/app/html/datacron/index.js'
app.get('/test', async(req, res)=>{
  try{
    /*
    let statMap = (await dataCache.get('configMaps', { _id: 'statDefMap' })).data
    let data = (await testCache.get('data', { _id: 'dc' })).data

    let html = getHtml(data[29].crons, data[30].def, statMap, { userMode: 'light', name: 'Scuba', statsOnly: true })
    */
    let html = (await testCache.get('webRender', { _id: 'webRender' } )).html?.replace('dark.css', 'light.css')
    if(html){
      res.status(200).send(html)
    }else{
      res.sendStatus(400)
    }
  }catch(e){
    log.error(e)
    res.sendStatus(400)
  }
})

function getKey(){
  return `w_${Date.now()}`
}

async function handlePuppeteerRequest(req, res){
  try{
    let html = cache.get(req?.query?.key)
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
async function handleWebRequest(req, res){
  try{
    if(!req?.body) return res.status(400).json({ status: 400, message: 'you did not provide corrent information' })
    const { uri, html, pKey, width, resizeImg } = req.body
    let reqUri = uri || `http://localhost:${PORT}/puppeteer`

    if(html){
      let key = pKey || `w_${Date.now()}`
      cache.set(key, html)
      reqUri += `?key=${key}`
    }
    let img = await screenShot(reqUri, width, resizeImg)
    if(img){
      res.set('Content-Type', 'image/png')
      res.status(200).send(img)
    }else{
      res.status(400).json({status: 400, message: 'error getting image'})
    }
  }catch(e){
    log.error(e);
    res.status(400).json({status: 400, message: 'Error occured'})
  }
}
const server = app.listen(PORT, ()=>{
    log.info(`web render server is listening on ${server.address().port}...`)
  })
