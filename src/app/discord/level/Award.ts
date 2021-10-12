export default class Award {

    _requireLevel: number;
    _roleName: string;

    constructor(requireLevel: number, roleName: string) {
        this._requireLevel = requireLevel;
        this._roleName = roleName;
    }

    get requireLevel(): number {
        return this._requireLevel;
    }

    get roleName(): string {
        return this._roleName;
    }
}