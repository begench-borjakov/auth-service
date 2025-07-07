import { IsOptional, IsString, IsEmail, MinLength, Matches, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'bega_dev',
    description: 'New username (max 30 characters)',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Username must be at most 30 characters' })
  @Transform(({ value }) => value?.trim())
  username?: string

  @ApiPropertyOptional({
    example: 'bega@example.com',
    description: 'New valid email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  email?: string

  @ApiPropertyOptional({
    example: 'pass1234',
    description:
      'New password (at least 6 characters, must contain at least one letter and one number)',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password?: string
}
