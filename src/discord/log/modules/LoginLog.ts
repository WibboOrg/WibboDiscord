import { LogLoginDao } from '../../../database/daos/LogLoginDao'
import { getTime } from '../../utils'
import { ILog } from '../../types'

export default {
    seconds: 10,
    channelName: 'logs_connexion',
    getLastId: async () => await LogLoginDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await LogLoginDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.user.username + '** à ' + getTime(row.date) + '\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
