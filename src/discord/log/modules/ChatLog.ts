import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { ChatLogDao } from '../../../database/daos/ChatLogDao';
import { ChatLogEntity } from '../../../database/entities/ChatLogEntity';

export class ChatLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await ChatLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await ChatLogDao.getLastId();
            else
            {
                const results = await ChatLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: ChatLogEntity[])
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' + row.userName + '** à ' + this.getTime(row.timestamp) + ': `' + row.message + '`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_chats');
    }
}