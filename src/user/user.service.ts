import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user.dto';
import { UserExistException } from 'src/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {

    }
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        try {
            const { userName, passWord, email } = createUserDto;

            const user = await this.userRepository.findOne({ where: { email: email } })
            if (user) {
                throw new UserExistException();
            };

            const newUser = new UserEntity();
            newUser.userName = userName;
            newUser.passWord = await bcrypt.hash(passWord, 10)
            newUser.email = email;
            newUser.color = this.generateRandomColor();
            // Save data
            await this.userRepository.save(newUser);

            return newUser;
        } catch (e) {
            return Promise.reject(e);
        }
    }
    generateRandomColor(): string {
        const colors = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
}
