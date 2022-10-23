import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { LogLoginDao } from '../../../database/daos/LogLoginDao';
import { LogLoginEntity } from '../../../database/entities/LogLoginEntity';

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
            else
            {
                const results = await LogLoginDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: LogLoginEntity[])
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            const userIP = row.ip.substring(0, 6);

            // message += "**" + row.user.name + "** à " + this.getTime(row.date) + ": `" + row.userAgent + " (" + userIP + "...)`\n";
            message += '**' + row.user.name + '** à ' + this.getTime(row.date) + '\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_connexion');
    }
}