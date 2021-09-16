import { CmdLog } from './modules/CmdLog';
import { ChatPubLog } from './modules/ChatPubLog';
import { BoutiqueLog } from './modules/BoutiqueLog';
import { StaffLog } from './modules/StaffLog';
import { ChatLog } from './modules/ChatLog';
import { RegisterLog } from './modules/RegisterLog';
import { TradeLog } from './modules/TradeLog';
import { LoginLog } from './modules/LoginLog';

import { Log } from './Log';
import { Manager } from '../../common/Manager';

export class LogManager extends Manager {
    private _logs: Log[];

    constructor() {
        super("logManager");

        this._logs = [];
    }

    public async onInit() {
        await this.loadLogs();

        for (const log of this._logs) await log.init();
    }

    public async onDispose() {
        for (const log of this._logs) await log.dispose();

        this._logs = [];
    }

    private async loadLogs() {
        this._logs.push(new CmdLog(5));
        this._logs.push(new ChatPubLog(10));
        this._logs.push(new BoutiqueLog(10));
        this._logs.push(new StaffLog(10));
        this._logs.push(new ChatLog(5));
        this._logs.push(new RegisterLog(10));
        this._logs.push(new TradeLog(5));
        this._logs.push(new LoginLog(5));
        // this._logs.push(new OnlineTimeStaffLog(60));
    }
}