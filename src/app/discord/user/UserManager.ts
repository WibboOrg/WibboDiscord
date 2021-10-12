import { User } from './User';
import { Manager } from '../../common/Manager';
import { DiscordUserDao } from '../../database/daos/DiscordUserDao';
import { getManager } from 'typeorm';
import { DiscordUserEntity } from '../../database/entities/DiscordUserEntity';

export class UserManager extends Manager {
    _users: User[];

    constructor() {
        super('UserManager');

        this._users = [];
    }

    protected async onInit(): Promise<void> { }

    protected async onDispose(): Promise<void> {
        while (this._users.length > 0) {
            const user = this._users.shift();

            if (!user) continue;

            await user.dispose();
        }
    }

    async registerUser(id: string): Promise<User> {
        const entity = new DiscordUserEntity();

        entity.id = id;

        await getManager().save(entity);

        const user = new User(entity);

        this.addUser(user);

        return user;
    }

    async getUserByClientId(id: string) {
        let user = this.getUserById(id);

        if (user) return user;

        user = await this.getOfflineUserById(id);

        if (user) return user;

        user = await this.registerUser(id);

        if (user) return user;

        return null;
    }

    async getOfflineUserById(id: string): Promise<User> {
        const entity = await DiscordUserDao.getUserById(id);

        if (!entity) return null;

        const user = new User(entity);

        this.addUser(user);

        return user;
    }

    getUserById(id: string): User {
        return this._users.find(u => u.id == id);
    }

    async addUser(user: User): Promise<void> {
        if (!(user instanceof User)) return;

        await this.removeUser(user.id);

        this._users.push(user);
    }

    async removeUser(id: string): Promise<void> {
        const user = this._users.find(u => u.id === id);

        if (!user) return;

        await user.dispose();

        const index = this._users.findIndex(u => u.id === id);
        this._users.splice(index, 1);
    }

    get users(): User[] {
        return this._users;
    }
}