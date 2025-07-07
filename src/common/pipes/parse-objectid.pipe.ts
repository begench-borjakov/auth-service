import { Injectable, PipeTransform } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { InvalidIdFormatException } from 'src/common/exceptions/custom.errors'

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new InvalidIdFormatException()
    }
    return value
  }
}
