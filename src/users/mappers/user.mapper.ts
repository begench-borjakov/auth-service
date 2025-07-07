import { plainToInstance } from 'class-transformer'
import { IUser } from 'src/database/user/user.interface'
import { UserRto } from '../rto/user.rto'

export function mapToUserRto(user: IUser): UserRto {
  return plainToInstance(
    UserRto,
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    {
      excludeExtraneousValues: true,
    }
  )
}
