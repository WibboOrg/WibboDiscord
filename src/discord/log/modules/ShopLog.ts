import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { LogShopDao } from '../../../database/daos/LogShopDao';
import { LogShopEntity } from '../../../database/entities/LogShopEntity';

export class ShopLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await LogShopDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await LogShopDao.getLastId();
            else
            {
                const results = await LogShopDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: LogShopEntity[])
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' +  row.user.name + '** à ' + this.getTime(row.date) + ': `' + row.content + ' (' + row.price + ' LTC)`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_boutique');
    }
}
