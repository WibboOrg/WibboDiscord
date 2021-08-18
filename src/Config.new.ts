import { ConfigOptions } from './app/common/interfaces/ConfigOptions';

export const Config: ConfigOptions =
{
    database: {
        type: 'mariadb',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '',
        database: '',
        entities: [],
        synchronize: false,
        logging: false,
        logger: 'file',
        debug: false
    },
	discord: {
        token: '',
        activity: '',
        defaultName: '',
        type: 'WATCHING',
        staffGuildId: '',
        communGuildId: '',
        checkLog: true,
        activityOnlineUser: false
    },
    serverMus: {
        enable: false,
        ip: '',
        port: 30001
    }
}