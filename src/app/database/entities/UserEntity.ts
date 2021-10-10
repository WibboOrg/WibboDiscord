import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'username', unique: true })
    public name: string;

    @Column({ name: 'look' })
    public look: string;

    @Column({ name: 'mail' })
    public mail: string;

    @Column({ name: 'motto' })
    public motto: string;

    @Column({ name: 'account_created' })
    public accountCreated: number;
    
    @Column({ name: 'ipcountry' })
    public ipCountry: string;

    @Column({ name: 'online' })
    public online: number;

    @Column({ name: 'is_banned' })
    public isBanned: number;

    @Column({ name: 'ip_last' })
    public ipLast: string;

    @Column({ name: 'machine_id' })
    public machineId: string;
}