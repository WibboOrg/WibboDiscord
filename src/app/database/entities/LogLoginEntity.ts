import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('logs_login')
export class LogLoginEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'user_id' })
    userId: string;
    
    @Column({ name: 'date' })
    date: number;
    
    @Column({ name: 'ip' })
    ip: string; 

    @Column({ name: 'user_agent' })
    userAgent: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}