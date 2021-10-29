import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cmdlogs')
export class CmdLogEntity
{
  @PrimaryGeneratedColumn({ name: 'id' })
      id: number;

  @Column({ name: 'user_id' })
      userId: number;

  @Column({ name: 'user_name' })
      userName: string;

  @Column({ name: 'roomid' })
      roomId: number;

  @Column({ name: 'command' })
      command: string;

  @Column({ name: 'extra_data' })
      extraData: string;

  @Column({ name: 'timestamp' })
      timestamp: number;
}
