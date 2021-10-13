import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff_ip')
export class IPStaffEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'ip' })
    ip: string;

    @Column({ name: 'username' })
    name: string;

    @Column({ name: 'hide' })
    hide: number;
}