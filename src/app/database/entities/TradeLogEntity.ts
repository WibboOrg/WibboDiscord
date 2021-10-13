import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('logs_trade')
export class TradeLogEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'user_one_id' })
    userOneId: number;

    @Column({ name: 'user_two_id' })
    userTwoId: number;

    @Column({ name: 'user_one_items' })
    userOneItems: string;

    @Column({ name: 'user_two_items' })
    userTwoItems: string;

    @Column({ name: 'room_id' })
    roomId: number;

    @Column({ name: 'time' })
    time: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_one_id' })
    userOne: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_two_id' })
    userTwo: UserEntity;
}