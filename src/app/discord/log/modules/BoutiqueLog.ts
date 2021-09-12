import { Log } from '../Log';
import { App } from '../../../App';
import { BoutiqueLogDao } from '../../../database/daos/BoutiqueLogDao';
import { BoutiqueLogEntity } from '../../../database/entities/BoutiqueLogEntity';

export class BoutiqueLog extends Log {
    constructor(seconds: number) {
        super(seconds);
    }

    public async onInit() {
        this.lastId = await BoutiqueLogDao.getLastId();

        this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
    }

    public async onDispose() {
        clearInterval(this.runInterval);
    }

    public async onRun() {
        try {
            if (this.lastId == -1) this.lastId = await BoutiqueLogDao.getLastId();

            else {
                const results = await BoutiqueLogDao.loadLastLog(this.lastId);
                this.rawLogs(results);
            }
        }

        catch (err) { console.log(err); }
    }

    private rawLogs(rows: BoutiqueLogEntity[]) {
        if (!rows) return;

        if (!rows.length) return;

        let message = "";
        for (const row of rows) {
            message += "**" + row.user.name + "** à " + this.getTime(row.date) + ": `" + row.achat + "`\n";

            this.lastId = row.id;
        }

        App.discordBot.sendMessage(message, 'logs_boutique');
    }
}