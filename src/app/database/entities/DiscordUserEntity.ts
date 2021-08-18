import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discord_users')
export class DiscordUserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'last_name', unique: true })
    public name: string;

    @Column({ name: 'experience', default: 0 })
    public experience: number;
}