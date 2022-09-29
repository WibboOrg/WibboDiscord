import { Log } from '../Log';
import { CmdLogDao } from '../../../database/daos/CmdLogDao';
import { CmdLogEntity } from '../../../database/entities/CmdLogEntity';
import { sendMessage } from '../../bot';

export class CmdLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await CmdLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await CmdLogDao.getLastId();
            else
            {
                const results = await CmdLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: CmdLogEntity[]): void
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        let messageWibboGame = '';
        for(const row of rows)
        {
            if(row.userName == 'WibboGame')
                messageWibboGame += '**' + row.userName + '** à ' + this.getTime(row.timestamp) + ': `' + row.extraData + '`\n';
            else
                message += '**' + row.userName + '** à ' + this.getTime(row.timestamp) + ': `' + row.extraData + '`\n';

            this.lastId = row.id;
        }

        if(message !== '')
            sendMessage(message, 'logs_commands');
        if(messageWibboGame !== '')
            sendMessage(messageWibboGame, 'logs_wibbogame');
    }
}
