import { CmdLog } from './modules/CmdLog';
import { ChatPubLog } from './modules/ChatPubLog';
import { BoutiqueLog } from './modules/BoutiqueLog';
import { StaffLog } from './modules/StaffLog';
import { ChatLog } from './modules/ChatLog';
import { RegisterLog } from './modules/RegisterLog';
import { TradeLog } from './modules/TradeLog';
import { LoginLog } from './modules/LoginLog';

import { Log } from './Log';
import { LootboxLog } from './modules/LootboxLog';
import { Config } from '../../config';

export const LogManager = async () =>
{
    if(Config.discord.checkLog)
        return;

    const logs: Log[] = [
        new CmdLog(5),
        new ChatPubLog,
        new BoutiqueLog,
        new StaffLog,
        new ChatLog(5),
        new RegisterLog,
        new TradeLog(5),
        new LoginLog(5),
        new LootboxLog
    ];

    for(const log of logs) await log.init();
};