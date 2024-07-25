import { userDao } from '../../../database/daos'
import { getTime } from '../../utils'
import { ILog } from '../../types'

export default {
    seconds: 5,
    channelName: 'logs_inscription',
    getLastId: async () => await userDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await userDao.getLastUsers(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.username + '** à ' + getTime(row.accountCreated) + ': `' + (row.ipcountry || '') + '`\n'
            
            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog