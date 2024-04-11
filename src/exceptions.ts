import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common'
import { Response } from 'express'
import { ERROR_CODE } from './constants'

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BookingNotFoundException extends BadRequestException {
  constructor() {
    super('Booking not found');
  }
}

export class ConflictException extends BadRequestException {
  constructor()
  {
    super('A booking already exists for the specified time range.')
  }
}

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super({ code: ERROR_CODE.VALIDATION_ERROR, errors })
  }
}

export class UserExistException extends BadRequestException {
  constructor() {
    super('User already exists');
  }
}

//Invalid password'
export class UserNotFoundException extends BadRequestException {
  constructor() {
    super('User not found');
  }
}

export class PasswordInvalidException extends BadRequestException {
  constructor() {
    super('Password or User invalid');
  }
}

export class UrlNotFoundException extends HttpException {
  constructor() {
    super('404', HttpStatus.NOT_FOUND)
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      debug: exception.message ?  {message: exception.message, status: exception.getStatus()} : {}
    })
  }
}
