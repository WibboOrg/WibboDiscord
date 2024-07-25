import dayjs from 'dayjs'
import { prisma } from '../prisma-client'
import { BanBantype } from '@wibbo/prisma'

export const banDao = {
    async insertBan(
        type: BanBantype,
        value: string,
        reason: string,
        expire: number,
        addedBy: string
    ) {
        await prisma.ban.create({
            data: {
                bantype: type,
                value: value,
                reason: reason,
                expire: expire,
                addedDate: dayjs().unix(),
                addedBy: addedBy
            }
        })
    },
    async expireBan(username: string, ip: string, expireTime: number) {
        await prisma.ban.updateMany({
            where: {
                OR: [{ value: ip, bantype: 'ip' }, { value: username, bantype: 'user' }],
            },
            data: {
                expire: expireTime
            }
        })
    },
    async expireIgnoreallBan(userId: number, expireTime: number) {
        await prisma.ban.updateMany({
            where: {
                value: userId.toString(),
                bantype: 'ignoreall'
            },
            data: {
                expire: expireTime
            }
        })
    }
}
