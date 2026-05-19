import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Item } from './entitys/item.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  

  getItems(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async checkDbConnection() { // asincorica porque la consulta a la base de datos es una operación que puede tomar tiempo
    try {
      const result = await this.dataSource.query('SELECT NOW() as now');
      return { status: 'ok', connected: true, timestamp: result[0].now };
    } catch (error) {
      return { status: 'error', connected: false, message: error.message };
    }
  }

  createItem(data: Partial<Item>): Promise<Item> {
    const item = this.itemRepository.create(data);
    return this.itemRepository.save(item);
  }
}
