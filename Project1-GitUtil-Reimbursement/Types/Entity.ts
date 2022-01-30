
import { RequestStatus} from './Enums';

export interface Profile{
    FirstName:string
    LastName:string
    id?:string
    Password?:string
    ManagerID?:string
    EmployeeArray?:string[]
    SendRequestIDArray?:string[]
}

export interface Request{
    id?:string
    Amount:number
    RequestStatus:RequestStatus
    PostDate:number
    ModifiedDate?:number
    InputMessage?:string
    ManagerMessage?:string

}

export interface HTTPCreateProfile{
    FirstName:string
    LastName:string
    Password:string
    id:string
}