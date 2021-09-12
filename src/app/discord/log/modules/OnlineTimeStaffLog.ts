import fs from 'fs';
import path from 'path';

import { Log } from '../Log';
import { App } from '../../../App';
import { getManager } from 'typeorm';

interface Staffs {
    onlineTime: number;
    dayInatif: number;
}

export class OnlineTimeStaffLog extends Log {
    private _staffs: Staffs[];
    private _dayReset: number;

    constructor(seconds: number) {
        super(seconds);

        this._dayReset = 0;

        const now = new Date();
        if (now.getHours() == 23) this._dayReset = now.getDay();

        this._staffs = [];

        this.loadUsers();
    }

    public async onInit() {
        //this.lastId = await StaffLogDaos.getLastId();

        this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
    }

    public async onDispose() {
        clearInterval(this.runInterval);
    }

    private loadUsers() {
        const file = path.join(__dirname, "../staffs.json");

        if (!fs.existsSync(file)) return;

        this._staffs = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    public async onRun() {
        try {
            const now = new Date();
            if (now.getDay() == this._dayReset || now.getHours() != 23) return;

            this._dayReset = now.getDay();

            const results = await getManager().query('SELECT users.username, users.id, cms_page_staff.rank, user_stats.OnlineTime FROM cms_page_staff INNER JOIN users ON(cms_page_staff.userid = users.id) INNER JOIN user_stats ON(cms_page_staff.userid = user_stats.id)');
            this.raw(results);
        }

        catch (err) { console.log(err); }
    }

    private raw(rows: any[]) {
        if (!rows) return;

        if (!rows.length) return;

        let message = "";
        let messageRank: string[] = [];

        let users = JSON.parse(JSON.stringify(this._staffs)) as Staffs[];
        this._staffs = [];

        for (const row of rows) {
            if (!users.hasOwnProperty(row.id)) {
                this._staffs[row.id] = {
                    onlineTime: row.OnlineTime,
                    dayInatif: 0
                };

                continue;
            }

            if (!messageRank.hasOwnProperty(row.rank)) messageRank[row.rank] = "";

            let TotalTime = row.OnlineTime - users[row.id].onlineTime;

            if (TotalTime > 0) {
                users[row.id].dayInatif = 0;
                let UserDate = this.getHMS(TotalTime);

                messageRank[row.rank] += "**" + row.username + "**: `" + UserDate.Hours + " Heures " + UserDate.Minutes + " Minutes et " + UserDate.Seconds + " Seconds (Total: " + TotalTime + " Seconds)`\n";
            }
            else {
                users[row.id].dayInatif++;
                messageRank[row.rank] += "**" + row.username + "**: `Inatif depuis " + users[row.id].dayInatif + " jours`\n";
            }

            this._staffs[row.id] = {
                onlineTime: row.OnlineTime,
                dayInatif: users[row.id].dayInatif
            };
        }

        fs.writeFileSync(path.join(__dirname, '../staffs.json'), JSON.stringify(this._staffs));

        if (messageRank.hasOwnProperty(6)) {
            message += "__**Staffs**__\n";
            message += messageRank[6];
            message += "\n";
        }

        // if (messageRank.hasOwnProperty(3)) 
        // {
        //     message += "__**Assistants Staffs**__\n";
        //     message += messageRank[3];
        //     message += "\n";
        // }

        if (message != "") App.discordBot.sendMessage(message, 'logs_staffconnexion');
    }

    private getHMS(totalSeconds: number) {
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        return {
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds
        };
    }
}