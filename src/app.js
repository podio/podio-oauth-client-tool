let express = require('express')
let app = express()
let podioJS = require('podio-js').api
let winston = require('winston')
let path = require('path')
let fs = require('fs-extra')

let configGenerator = require('./configGenerator')

// Config
let sessionStore = {
  get(authType, callback) {

    let filePath = path.join(__dirname, 'tmp', 'sessionStore.json')

    fs.readFile(filePath, 'utf8', (err, data) => {

      if (err && err.code !== 'ENOENT') {
        throw err
      } else if (err) {
        callback()
      } else {
        winston.log('debug', 'Reading from sessionStore', data)
        callback(JSON.parse(data))
      }
    })
  },

  set(podioOauth, authType, callback) {

    let filePath = path.join(__dirname, 'tmp', 'sessionStore.json')
    let data = JSON.stringify(podioOauth)

    fs.outputFile(filePath, data, err => {

      if (err) throw err;
      winston.log('debug', 'Writing to sessionStore', data)

      if (callback) {
        callback()
      }
    })
  }
}

winston.level = 'debug'
const PORT = 8000

let podio;

const redirecUrl = 'http://localhost:8000/callback'
let authConfig;

// Views
app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.use('/client', express.static('src/client'))

// Middleware
app.use((req, res, next) => {

  if (req.url === '/auth') return next();

  podio.isAuthenticated()
  .then(next)
  .catch(err => {
    if (req.query && req.query.code) {
      next()
    } else {
      res.redirect('/auth')
    }
  })
})

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/callback', (req, res) => {
  console.log(req.query);
  podio.getAccessToken(req.query.code, redirecUrl, err => {
    res.redirect('/')
  })
})

app.get('/auth', (req, res) => {
  res.render('index', authConfig)
})

app.get('/logout', (req, res) => {
  podio.request('POST', '/oauth/grant/invalidate')
  .then(() => {
    res.redirect('/auth')
  })
  .catch(err => {
    throw err
  })
})

app.all('/proxy*', (req, res) => {
  let url = req.params[0]
  let { method } = req

  winston.log('debug', method, url)

  podio.request(method, url).then(result => {
    res.json(result)
  })
  .catch(err => {
    res.status(err.status)
    res.send(err)
  })
})


configGenerator({
    tmpDir: path.join(__dirname, 'tmp')
  }, function(config) {
  
  podio  = new podioJS({
    authType: 'server',
    clientId: config.clientId,
    clientSecret: config.clientSecret
  }, {
    apiURL: config.apiURL,
    sessionStore: sessionStore
  })

  authConfig = {
    authUrl: podio.getAuthorizationURL(redirecUrl)
  }

  app.listen(PORT, () => {
    winston.info(`Listening on ${PORT}`)
  })
});
