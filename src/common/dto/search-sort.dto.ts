import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { SortDirection } from './sort-direction.enum'

export class SearchSort {

  @ApiPropertyOptional({
    enum: SortDirection,
    default: SortDirection.DESC,
  })
  @IsNotEmpty()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortField?: string

  @ApiPropertyOptional({
    default: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageNo?: number = 1

  @ApiPropertyOptional({
    default: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageSize?: number = 10
}
