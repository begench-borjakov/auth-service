import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from '../jwt/jwt-payload.interface'
import { generateAccessToken, generateRefreshToken } from '../jwt/jwt.utils'
import { verify } from 'jsonwebtoken'
import { jwtConstants } from '../jwt/jwt.constants'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class TokenService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(TokenService.name)
  }

  async generateTokens(
    payload: JwtPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(payload),
      generateRefreshToken(payload),
    ])

    this.logger.debug(`Generated tokens for user: ${payload.email}`)

    return {
      accessToken,
      refreshToken,
    }
  }

  verifyAccessToken(token: string): JwtPayload {
    this.logger.debug('Verifying access token...')
    return this.verifyToken(token, jwtConstants.accessSecret)
  }

  verifyRefreshToken(token: string): JwtPayload {
    this.logger.debug('Verifying refresh token...')
    return this.verifyToken(token, jwtConstants.refreshSecret)
  }

  private verifyToken(token: string, secret: string): JwtPayload {
    try {
      const payload = verify(token, secret) as JwtPayload
      this.logger.debug(`Token verified: userId=${payload.sub}, email=${payload.email}`)
      return payload
    } catch {
      this.logger.warn('Token verification failed')
      throw new UnauthorizedException('Invalid token')
    }
  }

  async invalidateRefreshToken(_token: string): Promise<void> {
    this.logger.debug('invalidateRefreshToken() called — not yet implemented')
  }

  async isRefreshTokenValid(_token: string): Promise<boolean> {
    this.logger.debug('isRefreshTokenValid() called — returning true (placeholder)')
    return true
  }
}
