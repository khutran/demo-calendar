import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>
}

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    findAndCount: jest.fn(entity => entity),
    create: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
    softDelete: jest.fn(entity => entity),
    createQueryBuilder: jest.fn(rootEntity => ({
      leftJoin: jest.fn().mockReturnThis(),
      leftJoinAndMapOne: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
    })),
    // ...
  })
)

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
