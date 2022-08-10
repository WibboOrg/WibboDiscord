import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('item_base')
export class ItemBaseEntity
{
@PrimaryGeneratedColumn({ name: 'id' })
    id: number;

@Column({ name: 'item_name' })
    itemName: string;

@Column({ name: 'rarity_level' })
    rarityLevel: number;
}
