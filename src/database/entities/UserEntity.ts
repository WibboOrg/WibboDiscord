import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
        id: number;

    @Column({ name: 'username', unique: true })
        name: string;

    @Column({ name: 'look' })
        look: string;

    @Column({ name: 'mail' })
        mail: string;

    @Column({ name: 'motto' })
        motto: string;

    @Column({ name: 'account_created' })
        accountCreated: number;

    @Column({ name: 'last_online' })
        lastOnline: number;

    @Column({ name: 'ipcountry' })
        ipCountry: string;

    @Column({ name: 'online' })
        online: number;

    @Column({ name: 'is_banned' })
        isBanned: string;

    @Column({ name: 'ip_last' })
        ipLast: string;

    @Column({ name: 'machine_id' })
        machineId: string;
}
