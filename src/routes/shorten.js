const { Router } = require('express')

const validUrl = require('../utils/validator').validUrl
const shortner = require('../utils/shortner')

const route = Router()

route.post('/shortcode', (req, res) => {
	console.log('request:- ' + req.body)
	let url = req.body.longUrl
	let code = req.body.code

	console.log('url: ' + url)
	console.log('code: ' + code)

	var http = /^https?:\/\//i
	if (!http.test(url)) {
		url = 'http://' + url
	}

	if (!validUrl(url)) {
    	return res.send('Unsupported link')
  	}

  	shortner.shorten(url, code, function (shortcode, existed, longURL) {
      return res.send({
        shortcode, existed, longURL
      })
    })
})

module.exports = route