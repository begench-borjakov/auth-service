import * as ms from 'ms'

export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  accessExpiresIn: ms('15m') / 1000, // число секунд
  refreshExpiresIn: ms('7d') / 1000, // число секунд
}
