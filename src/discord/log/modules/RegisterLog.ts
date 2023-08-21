import { Log } from '../Log';
import { sendMessage } from '../../bot';
import { UserDao } from '../../../database/daos/UserDao';

export class RegisterLog extends Log
{
    constructor(seconds: number = 10)
    {
        super(seconds);
    }

    async onInit()
    {
        this.lastId = await UserDao.getLastId();

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
            if(this.lastId == -1) this.lastId = await UserDao.getLastId();
            else await this.rawLogs();
        }
        catch (err)
        {
            console.log(err);
        }
    }

    async rawLogs()
    {
        const rows = await UserDao.getLastUsers(this.lastId);

        if(!rows) return;

        if(!rows.length) return;

        let messageTxt = '';
        for(const row of rows)
        {
            messageTxt += '**' + row.username + '** à ' + this.getTime(row.accountCreated) + ': `' + (row.ipcountry || '') + '`\n';
            
            this.lastId = row.id;
        }

        if(messageTxt.length)
            sendMessage(messageTxt, 'logs_inscription');
    }
}