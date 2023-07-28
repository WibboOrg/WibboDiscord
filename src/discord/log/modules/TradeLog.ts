import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { TradeLogDao } from '../../../database/daos/TradeLogDao';

export class TradeLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await TradeLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await TradeLogDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await TradeLogDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            if(row.userOneItems.length)
                message +='**' + row.userOneTrade.username + '** (' + row.userTwoTrade.username + ') à ' + this.getTime(row.time) + ': `' + row.userOneItems + '`\n';
            if(row.userTwoItems.length)
                message += '**' + row.userTwoTrade.username + '** (' + row.userOneTrade.username + ') à ' + this.getTime(row.time) + ': `' + row.userTwoItems + '`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_troc');
    }
}
