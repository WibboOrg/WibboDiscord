import { join } from 'path';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Config } from '../config';

Config.database.entities.push(join(__dirname, '/entities/*Entity.*'));

export const database = new DataSource(Config.database as MysqlConnectionOptions);