import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login-user.dto'
import { comparePasswords } from 'src/common/utils/hash.util'
import { TokenService } from './token/token.service'
import { AuthTokensRto } from './rto/auth-tokens.rto'
import { UserRole } from './decorators/roles.decorator'
import { toJwtPayload } from 'src/common/utils/user.util'
import { JwtPayload } from './jwt/jwt-payload.interface'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(AuthService.name)
  }

  async register(dto: RegisterDto): Promise<AuthTokensRto> {
    this.logger.log(`Registering user: ${dto.email}`)

    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) {
      this.logger.warn(`Attempt to register with existing email: ${dto.email}`)
      throw new ConflictException('A user with this email already exists')
    }

    const user = await this.usersService.createUserEntity({
      ...dto,
      role: UserRole.USER,
    })

    const tokens = await this.tokenService.generateTokens(toJwtPayload(user))
    await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)

    this.logger.log(`User registered: ${user.email}`)
    return this.buildAuthResponse(user.email, user.username, tokens)
  }

  async login(dto: LoginDto): Promise<AuthTokensRto> {
    this.logger.log(`Login attempt: ${dto.email}`)

    const user = await this.usersService.findEntityByEmail(dto.email)
    if (!user) {
      this.logger.warn(`Login with non-existent email: ${dto.email}`)
      throw new UnauthorizedException('Invalid credentials')
    }

    const isMatch = await comparePasswords(dto.password, user.password)
    if (!isMatch) {
      this.logger.warn(`Incorrect password for user: ${dto.email}`)
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = await this.tokenService.generateTokens(toJwtPayload(user))
    await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)

    this.logger.log(`User logged in: ${user.email}`)
    return this.buildAuthResponse(user.email, user.username, tokens)
  }

  async refresh(refreshToken: string): Promise<AuthTokensRto> {
    this.logger.log('Refreshing token')

    const payload: JwtPayload = this.tokenService.verifyRefreshToken(refreshToken)
    const user = await this.usersService.findEntityById(payload.sub)

    if (!user || user.refreshToken !== refreshToken) {
      this.logger.warn(`Invalid refresh token: ${refreshToken}`)
      throw new UnauthorizedException('Invalid refresh token')
    }

    const tokens = await this.tokenService.generateTokens(toJwtPayload(user))
    await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)

    this.logger.log(`Refresh token renewed for: ${user.email}`)
    return this.buildAuthResponse(user.email, user.username, tokens)
  }

  async logout(userId: string): Promise<void> {
    this.logger.log(`User logged out: ${userId}`)
    await this.usersService.updateRefreshToken(userId, '')
  }

  private buildAuthResponse(
    email: string,
    username: string,
    tokens: { accessToken: string; refreshToken: string }
  ): AuthTokensRto {
    return {
      email,
      username,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }
}
