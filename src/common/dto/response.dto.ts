import { ApiProperty } from '@nestjs/swagger'

export class ResponseDto<T> {
  data: T[]

  @ApiProperty()
  totalRecords?: number

  @ApiProperty()
  totalPages?: number

  @ApiProperty()
  pageNo: number

  @ApiProperty()
  pageSize: number
}

export class ResponseSuccessDto<T> {
  data: T[]

  @ApiProperty()
  message?: string

  @ApiProperty()
  statusCode: number
}
