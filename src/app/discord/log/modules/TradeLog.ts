import { Log } from '../Log';
import { App } from '../../../App';
import { TradeLogDao } from '../../../database/daos/TradeLogDao';
import { TradeLogEntity } from '../../../database/entities/TradeLogEntity';

export class TradeLog extends Log
{
    constructor(seconds: number) 
    {
        super(seconds);
    }

    public async onInit()
    {
        this.lastId = await TradeLogDao.getLastId();

        this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
    }

    public async onDispose()
    {
        clearInterval(this.runInterval);
    }

    public async onRun()
    {
        try
        {
            if (this.lastId == -1) this.lastId = await TradeLogDao.getLastId();

            else 
            {
                const results = await TradeLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }

        catch (err) { console.log(err); }
    }

    private rawLogs(rows: TradeLogEntity[]) 
    {
        if(!rows) return;
        
        if (!rows.length) return;

        let message = "";
        for (const row of rows)
        {
            if(row.userOneItems.length) message += "**" + row.userOne.name + "** (" + row.userTwo.name + ") à " + this.getTime(row.time) + ": `" + row.userOneItems + "`\n";
            if(row.userTwoItems.length) message += "**" + row.userTwo.name + "** (" + row.userOne.name + ") à " + this.getTime(row.time) + ": `" + row.userTwoItems + "`\n";

            this.lastId = row.id;
        }

        App.discordBot.sendMessage(message, 'logs_troc');
    }
}