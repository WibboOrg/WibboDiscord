import { chatLogDao } from '../../../database/daos'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 5,
    channelName: 'logs_chats',
    getLastId: async () => await chatLogDao.getLastId(),
    rawLogs: async (lastId: number) => {
        const rows = await chatLogDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.userName + '** à ' + getTime(row.timestamp) + ': `' + row.message + '`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog