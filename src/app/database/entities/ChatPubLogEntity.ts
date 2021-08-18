import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatlogs_pub')
export class ChatPubLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'user_name' })
    public userName: string;

    @Column({ name: 'message' })
    public message: string;

    @Column({ name: 'timestamp' })
    public timestamp: number;
}