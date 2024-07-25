import { logSlotMachineDao } from '../../../database/daos'
import { getTime } from '../../utils'
import { ILog } from '../../types'

export default {
    seconds: 10,
    channelName: 'logs_slotmachine',
    getLastId: async () => await logSlotMachineDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await logSlotMachineDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' +  row.user.username + '** à ' + getTime(row.date) + ': `' + (row.isWin ? "Gagnée" : "Perdu") + ' (' + row.amount + ' Points)`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog
