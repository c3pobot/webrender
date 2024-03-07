'use strict'
process.on('unhandledRejection', (error) => {
  console.error(error)
});
global.baseDir = __dirname
const Server = require('./src')
