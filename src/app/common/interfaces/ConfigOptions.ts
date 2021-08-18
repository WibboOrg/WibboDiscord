import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ActivityType } from 'discord.js';

export interface ConfigOptions
{
    database: MysqlConnectionOptions,
    discord: {
        token: string,
        activity: string,
        defaultName: string,
        type: ActivityType,
        staffGuildId: string,
        communGuildId: string,
        checkLog: boolean,
        activityOnlineUser: boolean
    },
    serverMus: {
        enable: boolean,
        ip: string,
        port: number
    }
}