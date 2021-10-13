import { Message, GuildMember, PermissionResolvable } from "discord.js";

export abstract class Command {
    permissions: PermissionResolvable[];
    roles: string[];
    aliases: string[];

    constructor(permissions: PermissionResolvable[], roles: string[], ...nameOrAliases: string[]) {
        const aliases = [...nameOrAliases];

        if (!aliases || !aliases.length) throw new Error('invalid_alias');

        this.permissions = permissions;
        this.roles = roles;
        this.aliases = aliases;
    }

    hasPermissionsAndRoles(member: GuildMember): boolean {
        return member.permissions.has(this.permissions) || member.roles.cache.some(role => this.roles.includes(role.name));
    }

    async parse(message: Message, parts: string[]): Promise<void> {

    }
}