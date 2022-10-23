import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { BoutiqueLogDao } from '../../../database/daos/BoutiqueLogDao';
import { BoutiqueLogEntity } from '../../../database/entities/BoutiqueLogEntity';

export class BoutiqueLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await BoutiqueLogDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await BoutiqueLogDao.getLastId();
            else
            {
                const results = await BoutiqueLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: BoutiqueLogEntity[])
    {
        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' +  row.user.name + '** à ' + this.getTime(row.date) + ': `' + row.achat + '`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_boutique');
    }
}