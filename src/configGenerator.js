let inquirer = require('inquirer')
let fs = require('fs-extra')
let path = require('path')

module.exports = function(options, callback) {

  fs.readFile(path.join(options.tmpDir, 'client.json'), 'utf8', (err, data) => {
    if(!err) {
      fs.removeSync(path.join(options.tmpDir, 'sessionStore.json'));

      callback(JSON.parse(data))
    } else {
      inquirer.prompt([
        {
          name: 'apiURL',
          message: 'Please enter API URL',
          default: 'https://api.nextpodio.dk'
        },
        {
          name: 'clientId',
          message: 'Please enter client ID'
        },
        {
          name: 'clientSecret',
          message: 'Please enter client secret'
        }
      ], answers => {
        fs.outputFile(path.join(options.tmpDir, 'client.json'), JSON.stringify(answers), err => {
          callback(answers)
        })
      })
    }
  })
}