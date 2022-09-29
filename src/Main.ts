import { database } from './database/app-data-source';
import { BoutiqueLogDao } from './database/daos/BoutiqueLogDao';
import * as bot from './discord/bot';

(async () =>
{
    await database.initialize();
    await bot.initialize();

    const id = await BoutiqueLogDao.getLastId();

    console.log(id);
})();