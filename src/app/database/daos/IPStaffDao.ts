import { getManager, MoreThan } from 'typeorm';
import { App } from '../../App';
import { IPStaffEntity } from '../entities/IPStaffEntity';

export class IPStaffDao
{
    static async updateIPStaff(userId: number, newIP: string): Promise<void>
    {
        const repository = App.INSTANCE.database.getRepository(IPStaffEntity);

        await repository
            .createQueryBuilder()
            .update(IPStaffEntity)
            .set({ ip: newIP })
            .where('id = :value', { value: userId })
            .execute();
    }
}
