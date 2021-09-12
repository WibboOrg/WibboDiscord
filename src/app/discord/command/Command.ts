import { Message, GuildMember, PermissionResolvable } from "discord.js";

export abstract class Command {
    private _permissions: PermissionResolvable[];
    private _roles: string[];
    private _aliases: string[];

    constructor(permissions: PermissionResolvable[], roles: string[], ...nameOrAliases: string[]) {
        const aliases = [...nameOrAliases];

        if (!aliases || !aliases.length) throw new Error('invalid_alias');

        this._permissions = permissions;
        this._roles = roles;
        this._aliases = aliases;
    }

    public get aliases(): string[] {
        return this._aliases;
    }

    public get roles(): string[] {
        return this._roles;
    }

    public get permissions(): PermissionResolvable[] {
        return this._permissions;
    }


    public hasPermissionsAndRoles(member: GuildMember): boolean {
        return member.permissions.has(this.permissions) || member.roles.cache.some(role => this.roles.includes(role.name));
    }

    public async parse(message: Message, parts: string[]): Promise<void> {

    }
}