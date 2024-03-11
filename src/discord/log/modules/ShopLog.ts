import { LogShopDao } from '../../../database/daos/LogShopDao'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 10,
    channelName: 'logs_boutique',
    getLastId: async () => LogShopDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await LogShopDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' +  row.user.username + '** à ' + getTime(row.date) + ': `' + row.content + ' (' + row.price + ' LTC)`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
