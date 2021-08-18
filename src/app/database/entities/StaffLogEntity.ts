import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cms_stafflog')
export class StaffLogEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    
    @Column({ name: 'pseudo' })
    public pseudo: string;

    @Column({ name: 'action' })
    public action: string;

    @Column({ name: 'date' })
    public date: number;
}