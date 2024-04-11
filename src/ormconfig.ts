import { typeormConfig } from './configuration'


export default {
  ...typeormConfig(),
  migrationsTableName: '__migrations__',
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}
