import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { Public } from './decorators/public.decorator'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserPayload } from './decorators/user-payload.interface'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login-user.dto'
import { AuthTokensRto } from './rto/auth-tokens.rto'
import { AppLogger } from 'src/common/logger/logger.service'
import { MeRto } from './rto/me.rto'
import { plainToInstance } from 'class-transformer'

// ✅ Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(AuthController.name)
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthTokensRto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() dto: RegisterDto): Promise<AuthTokensRto> {
    this.logger.log(` [register] Attempting to register user: ${dto.email}`)
    const result = await this.authService.register(dto)
    this.logger.log(` Registered user: ${dto.email}`)
    return result
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user and return tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthTokensRto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<AuthTokensRto> {
    this.logger.log(` [login] Attempting login for: ${dto.email}`)
    const result = await this.authService.login(dto)
    this.logger.log(` Logged in user: ${dto.email}`)
    return result
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: AuthTokensRto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensRto> {
    this.logger.log(` [refresh] Refreshing token`)
    const result = await this.authService.refresh(dto.refreshToken)
    this.logger.log(` Token refreshed`)
    return result
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout the authenticated user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() user: UserPayload): Promise<void> {
    this.logger.log(` [logout] Logging out user: ${user.email}`)
    await this.authService.logout(user.sub)
    this.logger.log(` Logged out user: ${user.email}`)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user information' })
  @ApiResponse({ status: 200, description: 'Current user info', type: MeRto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@CurrentUser() user: UserPayload): Promise<MeRto> {
    this.logger.log(` [me] Current user: ${user.email}`)
    return plainToInstance(MeRto, user)
  }
}
