import { database } from './database/app-data-source';
import * as bot from './discord/bot';

(async () =>
{
    await database.initialize();
    await bot.initialize();

    console.log('Discord Bot Ready!');
})();