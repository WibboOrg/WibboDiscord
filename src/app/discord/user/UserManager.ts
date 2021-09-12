import { User } from './User';
import { Manager } from '../../common/Manager';
import { DiscordUserDao } from '../../database/daos/DiscordUserDao';
import { getManager } from 'typeorm';
import { DiscordUserEntity } from '../../database/entities/DiscordUserEntity';

export class UserManager extends Manager {
    private _users: User[];

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

    public async registerUser(id: string): Promise<User> {
        const entity = new DiscordUserEntity();

        entity.id = id;

        await getManager().save(entity);

        const user = new User(entity);

        this.addUser(user);

        return user;
    }

    public async getUserByClientId(id: string) {
        let user = this.getUserById(id);

        if (user) return user;

        user = await this.getOfflineUserById(id);

        if (user) return user;

        user = await this.registerUser(id);

        if (user) return user;

        return null;
    }

    private async getOfflineUserById(id: string): Promise<User> {
        const entity = await DiscordUserDao.getUserById(id);

        if (!entity) return null;

        const user = new User(entity);

        this.addUser(user);

        return user;
    }

    private getUserById(id: string): User {
        return this._users.find(u => u.id == id);
    }

    public async addUser(user: User): Promise<void> {
        if (!(user instanceof User)) return;

        await this.removeUser(user.id);

        this._users.push(user);
    }

    public async removeUser(id: string): Promise<void> {
        const user = this._users.find(u => u.id === id);

        if (!user) return;

        await user.dispose();

        const index = this._users.findIndex(u => u.id === id);
        this._users.splice(index, 1);
    }

    public get users(): User[] {
        return this._users;
    }
}