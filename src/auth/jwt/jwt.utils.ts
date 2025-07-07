import { SignOptions, sign as signJwt } from 'jsonwebtoken'
import { JwtPayload } from './jwt-payload.interface'
import { jwtConstants } from './jwt.constants'

function signAsync(payload: JwtPayload, secret: string, options: SignOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    signJwt(payload, secret, options, (err, token) => {
      if (err || !token) {
        return reject(err || new Error('Token generation failed'))
      }
      resolve(token)
    })
  })
}

export async function generateAccessToken(payload: JwtPayload): Promise<string> {
  return await signAsync(payload, jwtConstants.accessSecret, {
    expiresIn: jwtConstants.accessExpiresIn,
  })
}

export async function generateRefreshToken(payload: JwtPayload): Promise<string> {
  return await signAsync(payload, jwtConstants.refreshSecret, {
    expiresIn: jwtConstants.refreshExpiresIn,
  })
}
