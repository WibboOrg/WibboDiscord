import { CmdGameLogDao } from '../../../database/daos/CmdGameLogDao'
import { ILog } from '../../types'
import { getTime } from '../../utils'

export default {
    seconds: 10,
    channelName: 'logs_wibbogame',
    getLastId: async () => await CmdGameLogDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await CmdGameLogDao.loadLastLog(lastId)

        if(!rows) return

        if (!rows.length) return

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
