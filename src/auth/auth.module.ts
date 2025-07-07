import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { TokenService } from './token/token.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { AppLogger } from 'src/common/logger/logger.service'

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy, AppLogger],
})
export class AuthModule {}
