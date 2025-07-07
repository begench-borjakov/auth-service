import {
  IsDefined,
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address. Max length: 100 characters.',
    maxLength: 100,
  })
  @Transform(({ value }) => value.trim())
  @IsDefined({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters.' })
  email: string

  @ApiProperty({
    example: 'pass1234',
    description:
      'Password between 6 and 64 characters. Must contain at least one letter and one number. Special characters allowed.',
    minLength: 6,
    maxLength: 64,
  })
  @Transform(({ value }) => value.trim())
  @IsDefined({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(64, { message: 'Password must not exceed 64 characters.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one letter and one number. Special characters are allowed.',
  })
  password: string

  @ApiProperty({
    example: 'bega_dev',
    description:
      'Username between 3 and 30 characters. Only letters, numbers, and underscores are allowed.',
    minLength: 3,
    maxLength: 30,
  })
  @Transform(({ value }) => value.trim())
  @IsDefined({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username must not be empty.' })
  @MinLength(3, { message: 'Username is too short.' })
  @MaxLength(30, { message: 'Username is too long.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string
}
