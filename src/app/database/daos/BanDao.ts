import { getManager, Raw } from "typeorm";
import { BanEntity, BanType } from "../entities/BanEntity";
import dayjs from 'dayjs';

export class BanDao {
    static async insertBan(type: BanType, value: string, reason: string, expire: number, addedBy: string) {
        const entity = new BanEntity();

        entity.banType = type;
        entity.value = value;
        entity.reason = reason;
        entity.expire = expire;
        entity.addedDate = dayjs().unix();
        entity.addedBy = addedBy;

        await getManager().save(entity);
    }

    static async expireBan(username: string, ip: string, expireTime: number) {
        await getManager()
            .createQueryBuilder()
            .update(BanEntity)
            .set({ expire: expireTime })
            .where("banType = :typeuser AND value = :valueuser", { typeuser: BanType.user, valueuser: username })
            .orWhere("banType = :typeip AND value = :valueip", { typeip: BanType.ip, valueip: ip })
            .execute();
    }
}