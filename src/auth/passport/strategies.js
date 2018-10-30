const OneauthStrategy = require('passport-oneauth').Strategy
const HttpBearerStrategy = require('passport-http-bearer').Strategy

const oneauthStrategy = new OneauthStrategy({
  clientID: '',
  clientSecret: '',
  callbackURL: '',
  include: []
}, (accessToken, refreshToken, profile, done) => {

})

const bearerStrategy = new HttpBearerStrategy((token, done) => {

})

module.exports = {
  oneauth: oneauthStrategy,
  bearer: bearerStrategy
}