import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log_staff')
export class StaffLogEntity
{
  @PrimaryGeneratedColumn({ name: 'id' })
      id: number;

  @Column({ name: 'pseudo' })
      pseudo: string;

  @Column({ name: 'action' })
      action: string;

  @Column({ name: 'date' })
      date: number;
}
