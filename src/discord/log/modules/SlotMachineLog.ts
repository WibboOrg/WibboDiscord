import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { LogSlotMachineDao } from '../../../database/daos/LogSlotMachineDao';

export class SlotMachineLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await LogSlotMachineDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await LogSlotMachineDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await LogSlotMachineDao.loadLastLog(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let message = '';
        for(const row of rows)
        {
            message += '**' +  row.user.username + '** à ' + this.getTime(row.date) + ': `' + (row.isWin ? "Gagnée" : "Perdu") + ' (' + row.amount + ' Points)`\n';

            this.lastId = row.id;
        }

        sendMessage(message, 'logs_slotmachine');
    }
}
