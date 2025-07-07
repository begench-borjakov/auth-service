import { ApiProperty } from '@nestjs/swagger'

export class AuthTokensRto {
  @ApiProperty({ example: 'bega@example.com' })
  email: string

  @ApiProperty({ example: 'bega' })
  username: string

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string
}
