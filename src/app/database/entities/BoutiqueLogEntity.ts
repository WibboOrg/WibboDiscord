import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('cms_boutique_logs')
export class BoutiqueLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'userid' })
    public userId: number;

    @Column({ name: 'date' })
    public date: number;

    @Column({ name: 'prix' })
    public prix: number;

    @Column({ name: 'achat'})
    public achat: string;

    @Column({ name: 'type' })
    public type: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userid' })
    public user: UserEntity;
}