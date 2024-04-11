import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginRequestDto {
  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  passWord: string
}
