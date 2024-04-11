import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { Public } from './decorators/role.decorator'
import { LoginRequestDto } from './dto/login-request.dto'
import { LoginResponseDto } from './dto/login-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()

  @ApiResponse({ type: LoginResponseDto, status: HttpStatus.OK })
  @Post('login')
  async login(
    @Body() loginUserDto: LoginRequestDto
  ): Promise<LoginResponseDto> {
    const userLogin: LoginResponseDto = await this.authService.login(
      loginUserDto
    )

    return userLogin
  }
}
