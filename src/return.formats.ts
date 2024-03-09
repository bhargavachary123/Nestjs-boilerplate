//methods return formats
export interface NormalMethodResponseType{
    Error: boolean;
    message: string;
}

export interface DataMethodResponseType{
    Error: boolean;
    message?: string;
    payload?:any
}

export interface LoginResponseType{
    Error:boolean;
    message?: string;
    access_token?:string;
    refresh_token?:string;
}