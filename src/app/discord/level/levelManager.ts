import { Manager } from "../../common/Manager";
import Award from "./Award";

export class RoleAwardManager extends Manager {
    _awards: Award[] = [];

    constructor() {
        super("RoleAwardManager");
    }

    async onInit() {
        this._awards.push(new Award(1, "Novice"));
        this._awards.push(new Award(5, "Spécialiste"));
        this._awards.push(new Award(10, "Expert"));
        this._awards.push(new Award(15, "Professionnel"));
        this._awards.push(new Award(20, "Maitre"));
    }

    async onDispose() {
        this._awards = [];
    }

    async getRoleAward(level: number) {

    }

    getLevelFromExp(exp: number) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return level;
    }

    getLevelProgress(exp: number) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return exp;
    }

    getLevelExp(level: number): number {
        return 5 * (Math.pow(level, 2)) + 50 * level + 100;
    }
}