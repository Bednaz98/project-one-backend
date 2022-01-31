
import { LoginReturn, ResultReturnCheck, ResultReturnString, TransferProfile, TransferProfileArray, TransferRecords, TransferRequest, TransferRequestArray } from './dto';
import {HTTPCreateProfile, Profile, Request} from './Entity';
import {RequestStatus} from './Enums';

export interface LogHTTPCInterface{
    Login(UserID:string, password:string):Promise<LoginReturn>
    CheckCreds(UserID:string, Authentication:string):boolean
    LogOut(UserID:string, Authentication:string):Promise<ResultReturnCheck>
}

export interface ProfileHTTPCInterface {
    /**Used to create a profile on the server*/
    CreateProfile(ProfileInit:HTTPCreateProfile):Promise<LoginReturn>

    /**Used to change the first name of an employee*/
    ChangeFirstName(EmployeeID:string, NewFirstName:string):Promise<ResultReturnString>

    /**Used to change the last name of an employee*/
    ChangeLastName(EmployeeID:string, NewLastName:string):Promise<ResultReturnString>

    /**Used to change the password of an employee*/
    ChangePassword(EmployeeID:string, NewPassword:string):Promise<ResultReturnString>

    /**Used to get the name this employee's manager*/
    GetManagerName(ManagerID:string):Promise<ResultReturnString>

    /**Used to make a request on the server*/
    MakeRequest(EmployeeID:string, Amount:number, Message:string):Promise<TransferRequest>

    /**Used by the client to mark a request as deleted*/ 
    DeleteRequest(EmployeeID:string, RequestID:string):Promise<ResultReturnCheck>

    /**Used to get all request of a specific type, all option will retrieve all request of any type this employee has access too*/
    GetAllSentRequestOfType(IDstring:string, Type:RequestStatus):Promise<TransferRequestArray>
}

export interface ManagerHTTPCLInterface{
    /**used when a manager changes the request status*/
    ManagerChangeRequest(ManagerID:string, RequestID:string,Type:RequestStatus, Message:string ):Promise<TransferRequest>
    ManagerGetAllRequest(ManagerID:string,Type:RequestStatus):Promise<TransferRequestArray>
    ManagerGetRecords():Promise<TransferRecords>
    CheckManagerPermissions(ID:string):Promise<ResultReturnCheck>
    CheckAdminPermissions(ID:string):Promise<ResultReturnCheck>
}

export interface AdminHTTPCLInterface{
    /**Used for an admin to get all employees*/
    AdminGetAllEmployees():Promise<TransferProfileArray>
    /**used when an admin tries to assign a manager*/
    AdminAssignManager(EmployeeID:string, ManagerID:string):Promise<ResultReturnCheck>
    /*used to remove an employee assignment*/
    AdminRemoveEmployeeAssignment(EmployeeID:string, ManagerID:string, AdminID:string):Promise<ResultReturnCheck>
    /**Delete Profile*/
    AdminDeleteProfile(EmployeeID:string):Promise<ResultReturnCheck> 
    /**used to directly create a profile*/
    AdminCreateProfile(ProfileInit:HTTPCreateProfile, ManagerID:string):Promise<TransferProfile>
}