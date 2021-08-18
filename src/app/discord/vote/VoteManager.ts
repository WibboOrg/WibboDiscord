import { Manager } from "../../common/Manager";

export class VoteManager extends Manager
{
    private _timerId: number;

    constructor()
    {
        super('VoteManager');
    }

    protected async onInit(): Promise<void> {}

    protected async onDispose(): Promise<void>
    {
    }
}

interface IVote {
    id: number,
    
}