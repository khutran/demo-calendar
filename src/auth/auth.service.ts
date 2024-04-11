import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { PasswordInvalidException, UserNotFoundException } from 'src/exceptions';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  private async generateJwt(user): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async login(loginUserDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, passWord } = loginUserDto;

    // Tìm người dùng bằng email
    const user = await this.userRepository.findOne({ where: { email: email } });

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await bcrypt.compare(passWord, user.passWord);
    if (!isPasswordValid) {
      throw new PasswordInvalidException();
    }

    const jwt = await this.generateJwt(user);
    const userLoginDto = new LoginResponseDto();
    userLoginDto.accessToken = jwt;

    return userLoginDto;
  }
}
