import { Message, GuildMember, PermissionResolvable } from "discord.js";

export abstract class Command {
    _permissions: PermissionResolvable[];
    _roles: string[];
    _aliases: string[];

    constructor(permissions: PermissionResolvable[], roles: string[], ...nameOrAliases: string[]) {
        const aliases = [...nameOrAliases];

        if (!aliases || !aliases.length) throw new Error('invalid_alias');

        this._permissions = permissions;
        this._roles = roles;
        this._aliases = aliases;
    }

    get aliases(): string[] {
        return this._aliases;
    }

    get roles(): string[] {
        return this._roles;
    }

    get permissions(): PermissionResolvable[] {
        return this._permissions;
    }


    hasPermissionsAndRoles(member: GuildMember): boolean {
        return member.permissions.has(this.permissions) || member.roles.cache.some(role => this.roles.includes(role.name));
    }

    async parse(message: Message, parts: string[]): Promise<void> {

    }
}