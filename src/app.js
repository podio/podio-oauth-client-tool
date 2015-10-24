let express = require('express')
let app = express()
let podioJS = require('podio-js').api
let winston = require('winston')
let path = require('path')
let fs = require('fs')

// Config
let sessionStore = {
  get(authType, callback) {

    let filePath = path.join(__dirname, 'sessionStore.json');

    fs.readFile(filePath, 'utf8', (err, data) => {

      if (err && err.code !== 'ENOENT') {
        throw err
      } else if (err) {
        callback()
      } else {
        callback(JSON.parse(data))
      }
    })
  },

  set(podioOauth, authType, callback) {

    let filePath = path.join(__dirname, 'sessionStore.json');
    fs.writeFile(filePath, JSON.stringify(podioOauth), err => {

      if (err) throw err;
      callback()
    })
  }
}

winston.level = 'debug'
const PORT = 8000
let podio = new podioJS({
  authType: 'server',
  clientId: 'oauthtesting',
  clientSecret: '1JFBMVraP9MtogCGTZHV2AKbYWmm37qVKXUI70P0v9DTbAlT21R5CYriY5AjiPYN'
}, {
  apiURL: 'http://api.nextpodio.dk',
  sessionStore: sessionStore
})

const redirecUrl = 'http://localhost:8000/callback'

const config = {
  authUrl: podio.getAuthorizationURL(redirecUrl)
}

// Views
app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.use('/client', express.static('src/client'));

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
  podio.request('GET', '/org/').then(result => {
    res.render('dashboard')
  })
})

app.get('/callback', (req, res) => {
  podio.getAccessToken(req.query.code, redirecUrl, err => {
    res.redirect('/')
  })
})

app.get('/auth', (req, res) => {
  res.render('auth', config)
})

app.get('/proxy*', (req, res) => {
  let url = req.params[0]
  let { method } = req
  winston.log('debug', url, method)
  podio.request(req.method, url).then(result => {
    res.json(result)
  })
  .catch(err => {
    res.status(err.status)
    res.send(err)
  })
})

app.listen(8000, () => {
  winston.info('debug', `Listening on ${PORT}`)
})