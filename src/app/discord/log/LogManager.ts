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

export class LogManager extends Manager
{
    logs: Log[];

    constructor()
    {
        super('logManager');

        this.logs = [];
    }

    async onInit()
    {
        await this.loadLogs();

        for(const log of this.logs) await log.init();
    }

    async onDispose()
    {
        for(const log of this.logs) await log.dispose();

        this.logs = [];
    }

    async loadLogs()
    {
        this.logs.push(new CmdLog(5));
        this.logs.push(new ChatPubLog(10));
        this.logs.push(new BoutiqueLog(10));
        this.logs.push(new StaffLog(10));
        this.logs.push(new ChatLog(5));
        this.logs.push(new RegisterLog(10));
        this.logs.push(new TradeLog(5));
        this.logs.push(new LoginLog(5));
    }
}
