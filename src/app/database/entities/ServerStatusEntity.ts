import { PrimaryColumn, Entity } from 'typeorm';

@Entity('server_status')
export class ServerStatusEntity {
    @PrimaryColumn({ name: 'users_online' })
    usersOnline: number;
}