import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя (валидный формат)',
  })
  @Transform(({ value }) => value.trim())
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'Пароль (не менее 6 символов)',
    minLength: 6,
  })
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string
}
