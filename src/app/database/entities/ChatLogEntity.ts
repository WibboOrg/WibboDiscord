import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatlogs')
export class ChatLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'room_id' })
    public roomId: number;

    @Column({ name: 'user_name' })
    public userName: string;

    @Column({ name: 'message' })
    public message: string;

    @Column({ name: 'timestamp' })
    public timestamp: number;

    @Column({ name: 'type' })
    public type: string;
}