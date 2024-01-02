import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MysqlModule } from './mysql.module';
import { MysqlService } from './mysql.service';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlModule],
      useFactory: (mysqlService: MysqlService):TypeOrmModuleOptions => ({
        type: 'mysql',
        host: mysqlService.host,
        port: mysqlService.port,
        username: mysqlService.username,
        password: mysqlService.password,
        database: mysqlService.database,
        autoLoadEntities: true,
        charset: 'latin1',
        synchronize: false,
        logging: ["error"],
        logger: "file",
      }),
      inject: [MysqlService],
    }),
  ],
})
export class MysqlDatabaseProviderModule {}
