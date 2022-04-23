import { Log } from '../Log';
import { App } from '../../../App';
import { UserDao } from '../../../database/daos/UserDao';
import { UserEntity } from '../../../database/entities/UserEntity';

export class RegisterLog extends Log
{
    constructor(seconds: number)
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
            else
            {
                const results = await UserDao.getLastUsers(this.lastId);
                this.rawLogs(results);
            }
        }
        catch (err)
        {
            console.log(err);
        }
    }

    rawLogs(rows: UserEntity[]): void
    {
        if(!rows) return;

        if(!rows.length) return;

        const messages: MessageLog[] = [];
        for(const row of rows)
        {
            this.lastId = row.id;

            messages.push({
                name: row.name,
                date: row.accountCreated,
                action: row.ipCountry,
            });
        }

        let messageTxt = '';
        for(const message of messages)
        {
            messageTxt += '**' + message.name + '** à ' + this.getTime(message.date) + ': `' + message.action + '`\n';
        }

        if(messageTxt.length)
            App.INSTANCE.discordBot.sendMessage(messageTxt, 'logs_inscription');
    }
}

interface MessageLog {
  name: string;
  date: number;
  action: string;
}
