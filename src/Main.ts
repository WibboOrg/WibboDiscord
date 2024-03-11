import 'dotenv/config'
import * as bot from './discord/bot'

(async () =>
{
    await bot.initialize()

    console.log('Discord Bot Ready!')
})()