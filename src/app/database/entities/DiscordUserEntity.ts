import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discord_users')
export class DiscordUserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: string;

    @Column({ name: 'last_name', unique: true })
    name: string;

    @Column({ name: 'experience', default: 0 })
    experience: number;
}