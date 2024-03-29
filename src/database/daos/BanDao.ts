import dayjs from 'dayjs'
import { prisma } from '../prisma-client'
import { BanBantype } from '@wibbo/prisma'

export class BanDao {
    static async insertBan(
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
    }

    static async expireBan(username: string, ip: string, expireTime: number) {
        await prisma.ban.updateMany({
            where: {
                OR: [{ value: ip, bantype: 'ip' }, { value: username, bantype: 'user' }],
            },
            data: {
                expire: expireTime
            }
        })
    }

    static async expireIgnoreallBan(userId: number, expireTime: number) {
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
