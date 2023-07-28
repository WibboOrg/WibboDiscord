import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { LogLootboxDao } from '../../../database/daos/LogLootboxDao';

export class LootboxLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await LogLootboxDao.getLastId();

        this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
    }

    async onDispose()
    {
        clearInterval(this.runInterval);
    }

    async onRun()
    {
        try
        {
            if(this.lastId == -1) this.lastId = await LogLootboxDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await LogLootboxDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' + row.user.username + '** à ' + this.getTime(row.timestamp) + ' (' + row.interactionType + '): `' + row.itemBase.itemName + ' ('+ this.getRarity(row.itemBase.rarityLevel) +')`\n';

            this.lastId = row.id;
        }

        if(message === '') return;

        sendMessage(message, 'logs_lootbox');
    }

    getRarity(rarity: number): string
    {
        switch(rarity)
        {
            case 1:
                return 'Basique';
            case 2:
                return 'Commun';
            case 3:
                return 'Epic';
            case 4:
                return 'Légendaire';
            default:
                return 'Rare';
        }
    }
}
