import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { LogLoginDao } from '../../../database/daos/LogLoginDao';

export class LoginLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await LogLoginDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await LogLoginDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await LogLoginDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' + row.user.username + '** à ' + this.getTime(row.date) + '\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_connexion');
    }
}
