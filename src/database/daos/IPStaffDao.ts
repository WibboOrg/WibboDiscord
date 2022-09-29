import { database } from '../app-data-source';
import { IPStaffEntity } from '../entities/IPStaffEntity';

export class IPStaffDao
{
    static async updateIPStaff(userId: number, newIP: string): Promise<void>
    {
        const repository = database.getRepository(IPStaffEntity);

        await repository
            .createQueryBuilder()
            .update(IPStaffEntity)
            .set({ ip: newIP })
            .where('id = :value', { value: userId })
            .execute();
    }
}
