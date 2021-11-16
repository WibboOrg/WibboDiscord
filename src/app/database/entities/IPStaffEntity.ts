import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cms_staff_protect')
export class IPStaffEntity
{
  @PrimaryGeneratedColumn({ name: 'id' })
      id: number;

  @Column({ name: 'ip' })
      ip: string;

  @Column({ name: 'username' })
      name: string;

  @Column({ name: 'hide' })
      hide: number;
}
