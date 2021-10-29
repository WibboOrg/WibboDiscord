import { Log } from '../Log';
import { App } from '../../../App';
import { StaffLogDao } from '../../../database/daos/StaffLogDao';
import { StaffLogEntity } from '../../../database/entities/StaffLogEntity';

export class StaffLog extends Log
{
    constructor(seconds: number)
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
            else
            {
                const results = await StaffLogDao.loadLastLog(this.lastId);

                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: StaffLogEntity[])
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message +=
        '**' +
        row.pseudo +
        '** à ' +
        this.getTime(row.date) +
        ': `' +
        row.action +
        '`\n';

            this.lastId = row.id;
        }

        App.INSTANCE.discordBot.sendMessage(message, 'logs_administration');
    }
}
