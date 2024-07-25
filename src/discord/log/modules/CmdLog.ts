import { cmdLogDao } from '../../../database/daos'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 5,
    channelName: 'logs_commands',
    getLastId: async () => await cmdLogDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await cmdLogDao.loadLastLog(lastId)

        if(!rows || !rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.userName + '** à ' + getTime(row.timestamp) + ': `' + row.extraData + '`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
