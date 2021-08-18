import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cmdlogs')
export class CmdLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    
    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'user_name' })
    public userName: string;

    @Column({ name: 'roomid' })
    public roomId: number;

    @Column({ name: 'command' })
    public command: string;

    @Column({ name: 'extra_data' })
    public extraData: string;

    @Column({ name: 'timestamp' })
    public timestamp: number;
}