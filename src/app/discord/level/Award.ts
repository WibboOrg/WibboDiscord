export default class Award {
    
    private _requireLevel: number;
    private _roleName: string;

    constructor(requireLevel: number, roleName: string)
    {
        this._requireLevel = requireLevel;
        this._roleName     = roleName;
    }

    public get requireLevel(): number
    {
        return this._requireLevel;
    }

    public get roleName(): string
    {
        return this._roleName;
    }
}