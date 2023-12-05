import * as bot from './discord/bot';
import dotenv from 'dotenv';

(async () =>
{
    dotenv.config();

    await bot.initialize();

    console.log('Discord Bot Ready!');
})();