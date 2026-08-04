import jwt from 'jsonwebtoken'

export default class JwtToken {
     generate(payload, headers, expiresIn) {
        try {
            return jwt.sign(payload, headers, { expiresIn })
        } catch (error) {
            throw new Error('Error creating JWT token', error)
        }
     }

     verify(token, signature) {
        try {
            return jwt.verify(token, signature)
        } catch (e) {
            return null
        }
     }
}