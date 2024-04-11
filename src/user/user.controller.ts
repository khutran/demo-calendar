import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('')
    async createUser(
        @Body() createUserDto: CreateUserDto
    ) {
        return await this.userService.createUser(createUserDto);
    }
}
