import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Item } from './entitys/item.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): {} {
    return { status: 'ok', message: 'API is healthy' };
  }

  @Get('db-status')
  getDbStatus() {
    return this.appService.checkDbConnection();
  }

  @Get('items')
  getItems(): Promise<Item[]> {
    return this.appService.getItems();
  }

  @Post('create-item')
  createItem(@Body() body: Partial<Item>): Promise<Item> {
    return this.appService.createItem(body);
  }
}
