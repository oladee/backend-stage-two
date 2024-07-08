const jsonwebtoken = require('jsonwebtoken')

require('dotenv').config()

const privKey = process.env.PRIV_KEY

function issueJwtUser (user){
    const userId = user.userId

    const expiresIn = '1h'

    const payload = {
        sub : userId,
        iat : Date.now()
    }

    const signedToken = jsonwebtoken.sign(payload, privKey, {expiresIn : expiresIn, algorithm : 'RS256'})

    return {
        token : signedToken,
        expires : expiresIn
    }
}

module.exports =  issueJwtUser