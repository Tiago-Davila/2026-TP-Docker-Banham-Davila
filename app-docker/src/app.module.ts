import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entitys/item.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',        
      host: process.env.DB_HOST,
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
