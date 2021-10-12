import { getManager, MoreThan } from "typeorm";
import { IPStaffEntity } from "../entities/IPStaffEntity";

export class IPStaffDao
{
    static async updateIPStaff(userId: number, newIP: string): Promise<void>
    {
        await getManager()
        .createQueryBuilder()
        .update(IPStaffEntity)
        .set({ ip: newIP })
        .where("id = :value", { value: userId })
        .execute();
    }
}