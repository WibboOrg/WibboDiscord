import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bans')
export class BanEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'bantype' })
    banType: BanType;

    @Column({ name: 'value' })
    value: string;

    @Column({ name: 'reason' })
    reason: string;

    @Column({ name: 'expire' })
    expire: number;

    @Column({ name: 'added_by' })
    addedBy: string;

    @Column({ name: 'added_date' })
    addedDate: string;

    @Column({ name: 'appeal_state' })
    appealState: number;
}

export enum BanType {
    user = 'user',
    ip = 'ip',
    machine = 'machine'
}