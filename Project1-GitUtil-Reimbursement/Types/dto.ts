import { Profile, Request } from "./Entity";
import { RequestStatus } from "./Enums";




export interface ResultReturnCheck{
    ResultCheck:boolean
}

export interface ResultReturnString{
    ReturnString:string
}

export interface ResultReturnStringID{
    ReturnString:string
    AuthenticationString:string
}

export interface ResultReturnMarkRequest{
    ReturnString:string
    Type:RequestStatus
    Message:string
    AuthenticationString:string
}

export interface TransferRequest{
    ReturnRequest:Request
}

export interface TransferRequestArray{
    ReturnRequestArray:Request[]
}

export interface LoginReturn{
    ReturnProfile:Profile
    password:string
    AuthenticationString:string
}

export interface TransferProfile{
    ReturnProfile:Profile
}

export interface TransferProfileArray{
    ReturnProfileArray:Profile[]
}

export interface MakeRequestForm{
    Amount:number
    Message:string
    AuthenticationString:string
}

export interface TransferRecords{
    ReturnRecords:string[]
}