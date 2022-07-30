import { PrimaryColumn, Entity } from 'typeorm';

@Entity('emulator_status')
export class ServerStatusEntity
{
  @PrimaryColumn({ name: 'id' })
      id: number;

  @PrimaryColumn({ name: 'users_online' })
      usersOnline: number;
}
