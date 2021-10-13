import { Connection, createConnection } from 'typeorm';

import { DiscordBot } from './discord/DiscordBot';
import { Logger } from './common/utilities/Logger';
import { join } from 'path';
import { Config } from '../Config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export class App {
    timestampStarted: number;
    database: Connection;
    logger: Logger;
    discordBot: DiscordBot

    static INSTANCE: App;

    async bootstrap() {
        try {
            console.log(`__          _______ ____  ____   ____  `);
            console.log(`\\ \\        / /_   _|  _ \\|  _ \\ / __ \\ `);
            console.log(` \\ \\  /\\  / /  | | | |_) | |_) | |  | |`);
            console.log(`  \\ \\/  \\/ /   | | |  _ <|  _ <| |  | |`);
            console.log(`   \\  /\\  /   _| |_| |_) | |_) | |__| |`);
            console.log(`    \\/  \\/   |_____|____/|____/ \\____/ `);
            console.log("v0.0.1 by JasonDhose#0001");
            console.log();

            if (!App.INSTANCE) App.INSTANCE = this;

            this.logger = new Logger('App');

            if (!Config) {
                App.INSTANCE.logger.error('Invalid Configuration');

                return await App.INSTANCE.dispose();
            }

            if (Config.database.entities) Config.database.entities.push(join(__dirname, '/database/entities/*Entity.*'));

            App.INSTANCE.timestampStarted = Date.now();

            App.INSTANCE.logger.log(`Starting WibboDiscord`);

            App.INSTANCE.database = await createConnection(Config.database as MysqlConnectionOptions);
            App.INSTANCE.discordBot = new DiscordBot();
        }

        catch (err) {
            App.INSTANCE.logger.error(err.message || err, err.stack);

            await App.INSTANCE.dispose();
        }
    }

    async start() {
        try {
            await App.INSTANCE.discordBot.init();

            App.INSTANCE.logger.log(`Started in ${Date.now() - App.INSTANCE.timestampStarted}ms`);
        }

        catch (err) {
            App.INSTANCE.logger.error(err.message || err, err.stack);

            await App.INSTANCE.dispose();
        }
    }

    async dispose() {
        if (App.INSTANCE.discordBot) await App.INSTANCE.discordBot.dispose();

        if (App.INSTANCE.database && App.INSTANCE.database.isConnected) await App.INSTANCE.database.close();
    }

    async reboot() {
        try {
            await this.dispose();
            await this.bootstrap();
        }

        catch (err) {
            App.INSTANCE.logger.error(err.message || err, err.stack);
        }
    }
}