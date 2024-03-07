'use strict'
const sharp = require('sharp');
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
