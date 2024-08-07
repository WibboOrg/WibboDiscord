import { staffLogDao } from '../../../database/daos'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 10,
    channelName: 'logs_administration',
    getLastId: async () => await staffLogDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await staffLogDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.pseudo + '** à ' + getTime(row.date) + ': `' + row.action + '`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
