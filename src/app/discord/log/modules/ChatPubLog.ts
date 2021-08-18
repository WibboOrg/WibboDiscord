import { Log } from '../Log';
import { App } from "../../../App";
import { ChatPubLogDao } from '../../../database/daos/ChatPubLogDao';
import { ChatPubLogEntity } from '../../../database/entities/ChatPubLogEntity';

export class ChatPubLog extends Log 
{
    constructor(seconds: number) 
    {
        super(seconds);
    }

    public async onInit()
    {
        this.lastId = await ChatPubLogDao.getLastId();

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
            if (this.lastId == -1) this.lastId = await ChatPubLogDao.getLastId();

            else 
            {
                const results = await ChatPubLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }

        catch (err) { console.log(err); }
    }

    private rawLogs(rows: ChatPubLogEntity[]): void 
    {
        if(!rows) return;
        
        if (!rows.length) return;
        
        let message = "";
        for (const row of rows)
        {
            message += "**" + row.userName + "** à " + this.getTime(row.timestamp) + ": `" + row.message + "`\n";

            this.lastId = row.id;
        }

        App.discordBot.sendMessage(message, 'logs_pubs');
    }
}