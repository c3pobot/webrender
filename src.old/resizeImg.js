'use strict'
const sharp = require('sharp');
/*
module.exports = (img)=>{
  return new Promise(async(resolve, reject)=>{
    try{
      let image = await sharp(img)
      image
          .metadata()
          .then((metadata)=>{
            if(metadata.width > 1000) image.resize(1000);
            resolve(image.toBuffer())
          })
    }catch(e){
      reject(e)
    }
  })
}
*/

module.exports = async(img)=>{
  try{
    let image = await sharp(img)
    if(!image) return
    await image.resize(500, null, { withoutEnlargement: true })
    let data = await image.toBuffer({ resolveWithObject: true })
    return data?.data?.toString('base64')
  }catch(e){
    throw(e)
  }
}
