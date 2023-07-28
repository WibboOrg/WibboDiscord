import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { ChatPubLogDao } from '../../../database/daos/ChatPubLogDao';

export class ChatPubLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await ChatPubLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await ChatPubLogDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await ChatPubLogDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' + row.userName + '** à ' + this.getTime(row.timestamp) + ': `' + row.message + '`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_pubs');
    }
}
