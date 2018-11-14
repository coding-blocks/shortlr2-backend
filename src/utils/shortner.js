const r = require('convert-radix64')
const URL = require('../db/index').URL

const getRandomCode = function () {
    let randCode =
        // 2 digit number with 6 zeros
        (((Math.random() * 100) << 0) * 1000000)
        +
        //current milliseconds (cutting off last 2 digits), 6-digit
        (((new Date().getTime() / 100) << 0) % 1000000);
    return randCode;

}

module.exports = {
	shorten: (longUrl, code, done) => {
		let alias = null

		if (!code) {
			code = getRandomCode()
		} else {
			if (code.length <= 8) {
				code = r.from64(code)
			} else {
				alias = code
				code = getRandomCode()
			}
		}

		URL.create({code: code, codeStr: r.to64(code), codeActual: r.to64(code), longUrl: longUrl})
			.then(url => {
				done(r.to64(code), false, longUrl)
			})
			.catch(err => {
				done(err)
			})
	}
}