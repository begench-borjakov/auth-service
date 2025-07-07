import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { UserRole } from 'src/auth/decorators/roles.decorator'

export class CreateUserDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
