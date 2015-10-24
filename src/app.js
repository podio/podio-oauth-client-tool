let express = require('express')
let app = express()
let podioJS = require('podio-js').api;

// Config
const PORT = 8000
let podio = new podioJS({
  authType: 'server',
  clientId: 'oauthtesting',
  clientSecret: '1JFBMVraP9MtogCGTZHV2AKbYWmm37qVKXUI70P0v9DTbAlT21R5CYriY5AjiPYN'
}, {
  apiURL: 'http://api.nextpodio.dk'
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

  if (req.url === '/auth') {
    return next()
  }

  podio.isAuthenticated()
  .then(() => {

    next()
  })
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
  console.log(url, method)
  podio.request(req.method, url).then(result => {
    console.log(result)
    res.send(result)
  })
  .catch(err => {
    console.log(err)
    res.error(err)
  })
})

app.listen(8000, () => {
  console.log(`Listening on ${PORT}`)
})