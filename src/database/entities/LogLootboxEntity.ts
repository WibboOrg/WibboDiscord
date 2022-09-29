import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemBaseEntity } from './ItemBaseEntity';
import { UserEntity } from './UserEntity';

@Entity('log_lootbox')
export class LogLootboxEntity
{
@PrimaryGeneratedColumn({ name: 'id' })
    id: number;

@Column({ name: 'interaction_type' })
    interactionType: string;

@Column({ name: 'user_id' })
    userId: number;

@Column({ name: 'item_id' })
    itemId: number;

@Column({ name: 'base_id' })
    baseId: number;

@Column({ name: 'timestamp' })
    timestamp: number;

@ManyToOne(() => UserEntity)
@JoinColumn({ name: 'user_id' })
    user: UserEntity;

@ManyToOne(() => ItemBaseEntity)
@JoinColumn({ name: 'base_id' })
    itemBase: ItemBaseEntity;
}
