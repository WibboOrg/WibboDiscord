import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff_ip')
export class IPStaffEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'ip' })
    public ip: string;
    
    @Column({ name: 'username' })
    public name: string;
    
    @Column({ name: 'hide' })
    public hide: number;
}