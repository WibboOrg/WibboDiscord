import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { StaffLogDao } from '../../../database/daos/StaffLogDao';

export class StaffLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await StaffLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await StaffLogDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await StaffLogDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' + row.pseudo + '** à ' + this.getTime(row.date) + ': `' + row.action + '`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_administration');
    }
}
