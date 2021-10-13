import { Manager } from "../../common/Manager";
import { DiscordUserEntity } from "../../database/entities/DiscordUserEntity";
import { Message } from "discord.js";

export class User extends Manager {
    entity: DiscordUserEntity;
    lastMessageTime: number;

    constructor(entity: DiscordUserEntity) {
        super('User');

        if (!(entity instanceof DiscordUserEntity)) throw new Error('invalid_entity');

        this.entity = entity;

        this.logger.contextInstance = entity.name;
    }

    protected async onInit(): Promise<void> {

    }

    protected async onDispose(): Promise<void> {

    }

    async onMessage(message: Message) {
        const content = message.content;

        const timestamp = Math.floor(Date.now() / 1000);

        if (this.lastMessageTime >= timestamp - 2) return;

        this.lastMessageTime = timestamp;

        if (content.length <= 3) return;

        this.entity.experience += 1;

        // await getManager().save(this.entity);
    }

    get id(): string {
        return this.entity.id;
    }

    get name(): string {
        return this.entity.name;
    }

    get experience(): number {
        return this.entity.experience;
    }
}