import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('logs_trade')
export class TradeLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_one_id' })
    public userOneId: number;

    @Column({ name: 'user_two_id' })
    public userTwoId: number;

    @Column({ name: 'user_one_items' })
    public userOneItems: string;

    @Column({ name: 'user_two_items' })
    public userTwoItems: string;

    @Column({ name: 'room_id' })
    public roomId: number;

    @Column({ name: 'time' })
    public time: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_one_id' })
    public userOne: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_two_id' })
    public userTwo: UserEntity;
}