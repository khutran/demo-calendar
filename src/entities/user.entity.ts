import { IsNotEmpty } from 'class-validator'
import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({})
  @IsNotEmpty()
  userName: string

  @Column({})
  @IsNotEmpty()
  passWord: string

  @Column({})
  @IsNotEmpty()
  email: string

  @Column({})
  @IsNotEmpty()
  color: string
}
