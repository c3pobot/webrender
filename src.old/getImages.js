'use strict'
const shell = require('shelljs')
const GIT_EMAIL = process.env.GIT_EMAIL, GIT_REPO = process.env.GIT_REPO, GIT_TOKEN = process.env.GIT_TOKEN, GIT_USERNAME = process.env.GIT_USERNAME
const cloneRepo = async()=>{
  let code = shell.exec(`git clone -v https://${GIT_USERNAME:GIT_TOKEN}@github.com/${GIT_REPO}.git /app/public`)
  return code
}
