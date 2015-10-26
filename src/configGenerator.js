let inquirer = require('inquirer')
let fs = require('fs')
let path = require('path')

module.exports = function(options, callback) {

  fs.readFile(path.join(options.tmpDir, 'client.json'), 'utf8', (err, data) => {
    if(!err) {
      try {
        fs.unlinkSync(path.join(options.tmpDir, 'sessionStore.json'));
      } catch (e) {
        console.log(e)
      }

      callback(JSON.parse(data))
    } else {
      inquirer.prompt([
        {
          name: 'apiURL',
          message: 'Please enter API URL',
          default: 'http://api.nextpodio.dk'
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
        fs.writeFile(path.join(options.tmpDir, 'client.json'), JSON.stringify(answers), err => {
          callback(answers)
        })
      })
    }
  })
}