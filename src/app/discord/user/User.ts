import { Manager } from "../../common/Manager";
import { DiscordUserEntity } from "../../database/entities/DiscordUserEntity";
import { Message } from "discord.js";

export class User extends Manager {
    _entity: DiscordUserEntity;
    _lastMessageTime: number;

    constructor(entity: DiscordUserEntity) {
        super('User');

        if (!(entity instanceof DiscordUserEntity)) throw new Error('invalid_entity');

        this._entity = entity;

        this.logger.contextInstance = entity.name;
    }

    protected async onInit(): Promise<void> {

    }

    protected async onDispose(): Promise<void> {

    }

    async onMessage(message: Message) {
        const content = message.content;

        const timestamp = Math.floor(Date.now() / 1000);

        if (this._lastMessageTime >= timestamp - 2) return;

        this._lastMessageTime = timestamp;

        if (content.length <= 3) return;

        this._entity.experience += 1;

        // await getManager().save(this._entity);
    }

    get id(): string {
        return this._entity.id;
    }

    get name(): string {
        return this._entity.name;
    }

    get experience(): number {
        return this._entity.experience;
    }
}