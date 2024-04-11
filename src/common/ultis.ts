import { HttpStatus } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ResponseSuccessDto } from './dto/response.dto'

export function createPageResponse<T>(
  data: T[],
  pageRequest: any,
  totalRecords?: number
) {
  return {
    data,
    ...pageRequest,
    totalRecords,
    totalPages: Math.ceil(totalRecords / pageRequest.pageSize),
  }
}

export function createNoPageResponse<T>(data: T[], totalRecords?: number) {
  return {
    data,
    totalRecords,
  }
}

export function createSingleNoPageResponse<T>(data: T, totalRecords?: number) {
  return {
    data,
    totalRecords,
  }
}


export function createErrorResponse<T>(
  errorCode: string,
  statusCode: HttpStatus
) {
  return {
    statusCode,
    message: errorCode,
  }
}

export function createSuccessResponse<T>(
  data: T[],
  message = 'Update successfully',
  statusCode: HttpStatus = HttpStatus.OK
): ResponseSuccessDto<T> {
  return {
    data,
    message,
    statusCode,
  }
}
