import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonFilter } from './common/common.filter';
import { CommonInterceptor } from './common/common.interceptor';
import * as path from 'path';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/users.entity';
import { Role } from './user/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env.local'),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        console.log('11', configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        console.log(
          configService.get('MYSQL_SERVER_HOST'),
          configService.get('MYSQL_SERVER_DATABASE'),
        );
        return {
          type: 'mysql',
          host: configService.get('MYSQL_SERVER_HOST'),
          port: configService.get('MYSQL_SERVER_PORT'),
          username: configService.get('MYSQL_SERVER_USER'),
          password: configService.get('MYSQL_SERVER_PASSWORD'),
          database: configService.get('MYSQL_SERVER_DATABASE'),
          synchronize: true,
          logging: true,
          entities: [Permission, User, Role],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CommonFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CommonInterceptor,
    },
  ],
})
export class AppModule {}
