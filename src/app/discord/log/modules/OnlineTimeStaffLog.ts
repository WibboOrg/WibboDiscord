// import fs from 'fs';
// import path from 'path';

// import { Log } from '../Log';
// import { App } from '../../../App';
// import { getManager } from 'typeorm';

// interface Staffs {
//     online_time: number;
//     dayInatif: number;
// }

// export class online_timeStaffLog extends Log {
//     staffs: Staffs[];
//     dayReset: number;

//     constructor(seconds: number) {
//         super(seconds);

//         this.dayReset = 0;

//         const now = new Date();
//         if (now.getHours() == 23) this.dayReset = now.getDay();

//         this.staffs = [];

//         this.loadUsers();
//     }

//     async onInit() {
//         //this.lastId = await StaffLogDaos.getLastId();

//         this.runInterval = setInterval(() => this.run(), this.seconds * 1000);
//     }

//     async onDispose() {
//         clearInterval(this.runInterval);
//     }

//     loadUsers() {
//         const file = path.join(__dirname, "../staffs.json");

//         if (!fs.existsSync(file)) return;

//         this.staffs = JSON.parse(fs.readFileSync(file, 'utf8'));
//     }

//     async onRun() {
//         try {
//             const now = new Date();
//             if (now.getDay() == this.dayReset || now.getHours() != 23) return;

//             this.dayReset = now.getDay();

//             const results = await getManager().query('SELECT users.username, users.id, cms_page_staff.rank, user_stats.online_time FROM cms_page_staff INNER JOIN users ON(cms_page_staff.userid = users.id) INNER JOIN user_stats ON(cms_page_staff.userid = user_stats.id)');
//             this.raw(results);
//         }

//         catch (err) { console.log(err); }
//     }

//     raw(rows: any[]) {
//         if (!rows) return;

//         if (!rows.length) return;

//         let message = "";
//         let messageRank: string[] = [];

//         let users = JSON.parse(JSON.stringify(this.staffs)) as Staffs[];
//         this.staffs = [];

//         for (const row of rows) {
//             if (!users.hasOwnProperty(row.id)) {
//                 this.staffs[row.id] = {
//                     online_time: row.online_time,
//                     dayInatif: 0
//                 };

//                 continue;
//             }

//             if (!messageRank.hasOwnProperty(row.rank)) messageRank[row.rank] = "";

//             let TotalTime = row.online_time - users[row.id].online_time;

//             if (TotalTime > 0) {
//                 users[row.id].dayInatif = 0;
//                 let UserDate = this.getHMS(TotalTime);

//                 messageRank[row.rank] += "**" + row.username + "**: `" + UserDate.Hours + " Heures " + UserDate.Minutes + " Minutes et " + UserDate.Seconds + " Seconds (Total: " + TotalTime + " Seconds)`\n";
//             }
//             else {
//                 users[row.id].dayInatif++;
//                 messageRank[row.rank] += "**" + row.username + "**: `Inatif depuis " + users[row.id].dayInatif + " jours`\n";
//             }

//             this.staffs[row.id] = {
//                 online_time: row.online_time,
//                 dayInatif: users[row.id].dayInatif
//             };
//         }

//         fs.writeFileSync(path.join(__dirname, '../staffs.json'), JSON.stringify(this.staffs));

//         if (messageRank.hasOwnProperty(6)) {
//             message += "__**Staffs**__\n";
//             message += messageRank[6];
//             message += "\n";
//         }

//         // if (messageRank.hasOwnProperty(3)) 
//         // {
//         //     message += "__**Assistants Staffs**__\n";
//         //     message += messageRank[3];
//         //     message += "\n";
//         // }

//         if (message != "") App.INSTANCE.discordBot.sendMessage(message, 'logs_staffconnexion');
//     }

//     getHMS(totalSeconds: number) {
//         let hours = Math.floor(totalSeconds / 3600);
//         totalSeconds %= 3600;
//         let minutes = Math.floor(totalSeconds / 60);
//         let seconds = totalSeconds % 60;

//         return {
//             Hours: hours,
//             Minutes: minutes,
//             Seconds: seconds
//         };
//     }
// }