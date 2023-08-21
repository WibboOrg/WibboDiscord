import { CmdLog } from './modules/CmdLog';
import { ChatPubLog } from './modules/ChatPubLog';
import { ShopLog } from './modules/ShopLog';
import { StaffLog } from './modules/StaffLog';
import { ChatLog } from './modules/ChatLog';
import { RegisterLog } from './modules/RegisterLog';
import { TradeLog } from './modules/TradeLog';
import { LoginLog } from './modules/LoginLog';
import { SlotMachineLog } from './modules/SlotMachineLog';

import { Log } from './Log';
import { LootboxLog } from './modules/LootboxLog';
    
export const LogManager = async () =>
{
    if(process.env.DISCORD_CHECK_LOG !== "true")
        return;

    const logs: Log[] = [
        new CmdLog(5),
        new ChatPubLog(),
        new ShopLog(),
        new StaffLog(),
        new ChatLog(5),
        new RegisterLog(),
        new TradeLog(5),
        new LoginLog(5),
        new LootboxLog(),
        new SlotMachineLog()
    ];

    for (const log of logs) await log.init();
    
    console.log('Logs initialized!');
};