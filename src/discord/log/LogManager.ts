import * as modules from './modules' 

import { LogInterval } from './LogInterval'
    
export const LogManager = async () =>
{
    if(process.env.DISCORD_CHECK_LOG !== "true")
        return

    const logs: LogInterval[] = Object.values(modules).map(x => new LogInterval(x))

    for (const log of logs) await log.init()
    
    console.log('Logs initialized!')
}