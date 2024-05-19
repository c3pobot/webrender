'use strict'
const log = require('logger')
const puppeteer = require('puppeteer')
const ResizeImg = require('./resizeImg')
const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain'
]
let webBrowser, PUPPETEER_DATA_DIR = process.env.PUPPETEER_DATA_DIR || '/app/cache'
const CreateBrowser = async()=>{
  try{
    const payload = {
      headless: 'new',
      args: minimal_args,
      userDataDir: PUPPETEER_DATA_DIR,
      defaultViewport: { width: 1000, height: 50 }
    }
    webBrowser = await puppeteer.launch(payload)
  }catch(e){
    log.error(e);
  }
}
CreateBrowser()
module.exports = async(uri, browserWidth = 800, resizeImg = false)=>{
  try{
    if(!webBrowser) await CreateBrowser()
    if(webBrowser){
      const page = await webBrowser.newPage()
      await page.setViewport({ width: browserWidth, height: 50 })
      await page.goto(uri, { waitUntil: 'networkidle0' })
      let data = await page.screenshot({ fullPage: true, omitBackground: true})
      page.close()
      if(data && !data.status && resizeImg) data = await ResizeImg(data)
      return data
    }
  }catch(e){
    throw(e);
  }
}
