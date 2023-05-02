import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('log_shop')
export class LogShopEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
        id: number;

    @Column({ name: 'user_id' })
        userId: number;

    @Column({ name: 'date' })
        date: number;

    @Column({ name: 'price' })
        price: number;

    @Column({ name: 'content' })
        content: string;

    @Column({ name: 'type' })
        type: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
        user: UserEntity;
}
