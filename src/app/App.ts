import { Connection, createConnection } from 'typeorm';

import { DiscordBot } from './discord/DiscordBot';
import { Logger } from './common/utilities/Logger';
import { join } from 'path';
import { Config } from '../Config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export class App {
    private static _timestampStarted: number;
    private static _database: Connection;

    private static _logger: Logger = new Logger('App');

    private static _discordBot: DiscordBot

    public static async bootstrap() {
        try {
            console.log(`__          _______ ____  ____   ____  `);
            console.log(`\\ \\        / /_   _|  _ \\|  _ \\ / __ \\ `);
            console.log(` \\ \\  /\\  / /  | | | |_) | |_) | |  | |`);
            console.log(`  \\ \\/  \\/ /   | | |  _ <|  _ <| |  | |`);
            console.log(`   \\  /\\  /   _| |_| |_) | |_) | |__| |`);
            console.log(`    \\/  \\/   |_____|____/|____/ \\____/ `);
            console.log("v0.0.1 by JasonDhose#0001");
            console.log();

            if (!Config) {
                App._logger.error('Invalid Configuration');

                return await App.dispose();
            }

            if (Config.database.entities) Config.database.entities.push(join(__dirname, '/database/entities/*Entity.*'));

            App._timestampStarted = Date.now();

            App._logger.log(`Starting WibboDiscord`);

            App._database = await createConnection(Config.database as MysqlConnectionOptions);
            App._discordBot = new DiscordBot();
        }

        catch (err) {
            App._logger.error(err.message || err, err.stack);

            await App.dispose();
        }
    }

    public static async start() {
        try {
            await App._discordBot.init();

            App._logger.log(`Started in ${Date.now() - App._timestampStarted}ms`);
        }

        catch (err) {
            App._logger.error(err.message || err, err.stack);

            await App.dispose();
        }
    }

    public static async dispose() {
        if (App._discordBot) await App._discordBot.dispose();

        if (App._database && App._database.isConnected) await App._database.close();
    }

    public static async reboot() {
        try {
            await this.dispose();
            await this.bootstrap();
        }

        catch (err) {
            App._logger.error(err.message || err, err.stack);
        }
    }

    public static get logger(): Logger {
        return App._logger;
    }

    public static get database(): Connection {
        return App._database;
    }

    public static get discordBot(): DiscordBot {
        return App._discordBot;
    }
}