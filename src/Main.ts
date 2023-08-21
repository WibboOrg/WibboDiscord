import * as bot from './discord/bot';
import dotenv from 'dotenv';
import { initPrisma } from './database/prisma-client';

(async () =>
{
    dotenv.config();

    await initPrisma()

    await bot.initialize();

    console.log('Discord Bot Ready!');
})();