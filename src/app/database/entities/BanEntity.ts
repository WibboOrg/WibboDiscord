import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bans')
export class BanEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'bantype' })
    public banType: BanType;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'reason' })
    public reason: string;

    @Column({ name: 'expire'})
    public expire: number;

    @Column({ name: 'added_by' })
    public addedBy: string;

    @Column({ name: 'added_date' })
    public addedDate: string;

    @Column({ name: 'appeal_state' })
    public appealState: number;
}

export enum BanType {
    user = 'user',
    ip = 'ip',
    machine = 'machine'
  }