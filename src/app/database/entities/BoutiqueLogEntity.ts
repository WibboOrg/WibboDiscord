import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('log_shop')
export class BoutiqueLogEntity
{
  @PrimaryGeneratedColumn({ name: 'id' })
      id: number;

  @Column({ name: 'userid' })
      userId: number;

  @Column({ name: 'date' })
      date: number;

  @Column({ name: 'prix' })
      prix: number;

  @Column({ name: 'achat' })
      achat: string;

  @Column({ name: 'type' })
      type: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userid' })
      user: UserEntity;
}
