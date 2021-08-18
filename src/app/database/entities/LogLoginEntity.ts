import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('logs_login')
export class LogLoginEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: string;
    
    @Column({ name: 'date' })
    public date: number;
    
    @Column({ name: 'ip' })
    public ip: string; 

    @Column({ name: 'user_agent' })
    public userAgent: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}