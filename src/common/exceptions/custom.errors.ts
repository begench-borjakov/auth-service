import { BadRequestException, NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      statusCode: 404,
      error: 'Not Found',
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    })
  }
}

export class InvalidIdFormatException extends BadRequestException {
  constructor() {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid ID format',
      code: 'INVALID_ID_FORMAT',
    })
  }
}

export class EmptyUpdateDtoException extends BadRequestException {
  constructor() {
    super({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Update payload cannot be empty',
      code: 'EMPTY_UPDATE_DTO',
    })
  }
}
