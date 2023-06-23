'use strict'
process.on('unhandledRejection', (error) => {
  console.log(error)
});
const Server = require('./src')
Server(__dirname)
