import { TradeLogDao } from '../../../database/daos/TradeLogDao'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 5,
    channelName: 'logs_troc',
    getLastId: async () => await TradeLogDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await TradeLogDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            if(row.userOneItems.length)
                message +='**' + row.userOneTrade.username + '** (' + row.userTwoTrade.username + ') à ' + getTime(row.time) + ': `' + row.userOneItems + '`\n'
            if(row.userTwoItems.length)
                message += '**' + row.userTwoTrade.username + '** (' + row.userOneTrade.username + ') à ' + getTime(row.time) + ': `' + row.userTwoItems + '`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
