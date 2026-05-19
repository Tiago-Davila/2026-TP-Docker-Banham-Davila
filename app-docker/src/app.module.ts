import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entitys/item.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',        
      host: 'localhost',
      port: 3306,           
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DB,
      entities: [Item],
      synchronize: true,    // Solo en desarrollo, crea las tablas automáticamente
    }),
    TypeOrmModule.forFeature([Item]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
