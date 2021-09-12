import { Manager } from "../../common/Manager";
import Award from "./Award";

export class RoleAwardManager extends Manager {
    private _awards: Award[] = [];

    constructor() {
        super("RoleAwardManager");
    }

    public async onInit() {
        this._awards.push(new Award(1, "Novice"));
        this._awards.push(new Award(5, "Spécialiste"));
        this._awards.push(new Award(10, "Expert"));
        this._awards.push(new Award(15, "Professionnel"));
        this._awards.push(new Award(20, "Maitre"));
    }

    public async onDispose() {
        this._awards = [];
    }

    public async getRoleAward(level: number) {

    }

    public getLevelFromExp(exp: number) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return level;
    }

    public getLevelProgress(exp: number) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return exp;
    }

    private getLevelExp(level: number): number {
        return 5 * (Math.pow(level, 2)) + 50 * level + 100;
    }
}