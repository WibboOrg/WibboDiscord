import { Log } from '../Log';
import { App } from '../../../App';
import { StaffLogDao } from '../../../database/daos/StaffLogDao';
import { StaffLogEntity } from '../../../database/entities/StaffLogEntity';

export class StaffLog extends Log {
    constructor(seconds: number) {
        super(seconds);
    }

    public async onInit() {
        this.lastId = await StaffLogDao.getLastId();

        this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
    }

    public async onDispose() {
        clearInterval(this.runInterval);
    }

    public async onRun() {
        try {
            if (this.lastId == -1) this.lastId = await StaffLogDao.getLastId();

            else {
                const results = await StaffLogDao.loadLastLog(this.lastId);

                this.rawLogs(results);
            }
        }

        catch (err) { console.log(err); }
    }

    private rawLogs(rows: StaffLogEntity[]) {
        if (!rows) return;

        if (!rows.length) return;

        let message = "";
        for (const row of rows) {
            message += "**" + row.pseudo + "** à " + this.getTime(row.date) + ": `" + row.action + "`\n";

            this.lastId = row.id;
        }

        App.discordBot.sendMessage(message, 'logs_administration');
    }
}