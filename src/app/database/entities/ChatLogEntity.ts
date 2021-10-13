import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatlogs')
export class ChatLogEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'room_id' })
    roomId: number;

    @Column({ name: 'user_name' })
    userName: string;

    @Column({ name: 'message' })
    message: string;

    @Column({ name: 'timestamp' })
    timestamp: number;

    @Column({ name: 'type' })
    type: string;
}