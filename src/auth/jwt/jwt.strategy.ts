import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from './jwt.constants'
import { JwtPayload } from './jwt-payload.interface'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly logger: AppLogger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessSecret,
    })

    this.logger.setContext(JwtStrategy.name)
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(
      `User authorised: userId=${payload.sub}, email=${payload.email}, role=${payload.role}`
    )

    // Этот объект попадёт в request.user
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}
