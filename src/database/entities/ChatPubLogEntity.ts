import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log_chat_pub')
export class ChatPubLogEntity
{
  @PrimaryGeneratedColumn({ name: 'id' })
      id: number;

  @Column({ name: 'user_id' })
      userId: number;

  @Column({ name: 'user_name' })
      userName: string;

  @Column({ name: 'message' })
      message: string;

  @Column({ name: 'timestamp' })
      timestamp: number;
}
