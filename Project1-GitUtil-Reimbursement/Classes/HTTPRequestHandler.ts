import { HTTPCommands, RequestStatus } from "../Types/Enums";
import  Axios, { AxiosResponse }  from "axios";
import { AdminHTTPCLInterface, LogHTTPCInterface, ManagerHTTPCLInterface, ProfileHTTPCInterface } from "../Types/HTTPCommands";
import { HTTPCreateProfile, Profile, Request } from "../Types/Entity";
import { LoginReturn, MakeRequestForm, ResultReturnCheck, ResultReturnMarkRequest, ResultReturnString, TransferProfile, TransferProfileArray, TransferRecords, TransferRequest, TransferRequestArray } from "../Types/dto";
import {ResultReturnStringID} from '../Types/dto';


export default class  HTTPRequestHandler implements ProfileHTTPCInterface, ManagerHTTPCLInterface, AdminHTTPCLInterface, LogHTTPCInterface{
    // Unused =========================================================
    CheckCreds(UserID: string, Authentication: string): boolean {
        throw new Error("Not a useable outside of the server");
    }// Not Used ======================================================

    private PortNumber: number;
    private TargetURL: string;
    private AuthenticationString:string ='';
    private UserID:string = '';
    constructor(InputURL:string,InputPortNumber:number=3001){
        this.PortNumber = InputPortNumber ?? 3001 ;
        if(InputURL?.length>1) {this.TargetURL =  InputURL}
        else{this.TargetURL = 'http://localhost'}
    }
    // Internal Commands ===============================================
    private GetRoute(Command:HTTPCommands, ID:string){
        switch(Command){
            case HTTPCommands.CreateProfile:            { return `/Create`;}
            case HTTPCommands.Login:                    { return `/Login/${ID}`;}
            case HTTPCommands.LogOut:                   { return `/LogOut/${ID}`;}
            case HTTPCommands.ChangeFirstName:          { return `/Profile/${ID}/ChangeFirst`;}
            case HTTPCommands.ChangeLastName:           { return `/Profile/${ID}/ChangeLast`;}
            case HTTPCommands.ChangePassword:           { return `/Profile/${ID}/ChangePassword`;}
            case HTTPCommands.GetManageName:            { return `/Profile/${ID}`;}
            case HTTPCommands.MakeRequest:              { return `/Request/${ID}`;}
            case HTTPCommands.DeleteRequest:            { return `/Request/${ID}`;}
            case HTTPCommands.GetAllSentRequest:        { return `/Request/${ID}`;}
            case HTTPCommands.ManageChangeRequest:      { return `/Manager/${ID}`;}
            case HTTPCommands.ManagerGetAllRequest:     { return `/Manager/${ID}`;}
            case HTTPCommands.AdminCreateProfile:       { return `/AdminCreate`;}
            case HTTPCommands.AdminGetAllEmployees:     { return `/Admin/${ID}`;}
            case HTTPCommands.AdminAssignManager:       { return `/Admin/${ID}/Assign`;}
            case HTTPCommands.AdminRemoveEmployee:      { return `/Admin/${ID}/UnAssign`;}
            case HTTPCommands.AdminDeleteProfile:       { return `/Admin/${ID}`;}
            case HTTPCommands.GetRecords:               { return `/Records`;}
            case HTTPCommands.CheckAdminPermissions:    { return `/CheckAdminPermission/${ID}`;}
            case HTTPCommands.CheckManagerPermissions:  { return `/CheckManagerPermission/${ID}`;}
            default:                                    { return `/Connect`;}
        }
    }
    private constructURLPrefect(){
        if(this.PortNumber>0){ return `${this.TargetURL}:${this.PortNumber}`}
        else{ return `${this.TargetURL}`}
    }
    private CreateURL(Command:HTTPCommands,ID:string):string{
        return `${this.constructURLPrefect()}${this.GetRoute(Command,ID)}`;
    }
    //===================================================================
    private async CreateHTTPRequest(Command:HTTPCommands, body:any, ID:string):Promise<AxiosResponse<any, any>>{
        switch(Command){
            case HTTPCommands.CreateProfile:            { return await Axios.post   (this.CreateURL(Command,ID), body);}
            case HTTPCommands.Login:                    { return await Axios.post   (this.CreateURL(Command,ID), body);}
            case HTTPCommands.LogOut:                   { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.ChangeFirstName:          { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.ChangeLastName:           { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.ChangePassword:           { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.GetManageName:            { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.MakeRequest:              { return await Axios.post   (this.CreateURL(Command,ID), body);}
            case HTTPCommands.DeleteRequest:            { return await Axios.delete (this.CreateURL(Command,ID), body);}
            case HTTPCommands.GetAllSentRequest:        { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.ManageChangeRequest:      { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.ManagerGetAllRequest:     { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.AdminCreateProfile:       { return await Axios.post   (this.CreateURL(Command,ID), body);}
            case HTTPCommands.AdminGetAllEmployees:     { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.AdminAssignManager:       { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.AdminRemoveEmployee:      { return await Axios.patch  (this.CreateURL(Command,ID), body);}
            case HTTPCommands.AdminDeleteProfile:       { return await Axios.delete (this.CreateURL(Command,ID), body);}
            case HTTPCommands.GetRecords:               { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.CheckManagerPermissions:  { return await Axios.get    (this.CreateURL(Command,ID), body);}
            case HTTPCommands.CheckAdminPermissions:    { return await Axios.get    (this.CreateURL(Command,ID), body);}
            default:                                    { return await Axios.get    (this.CreateURL(5000,ID), body)   ;}
        }
    }

    
    // Helper Functions==========================================
    /**Used tp check the connection to the server*/
    async CheckConnection():Promise<boolean>{
        try {
            const ReturnStuff = await Axios.get( `${this.constructURLPrefect()}/Connect`);
            if(   ReturnStuff.status <300  ){ return true};
        } catch (error) {
            return false;
        }
        return false ;
    }
    /**Attempts to login the user*/ 
    async Login(UserID:string, password:string):Promise<LoginReturn> {
        const Command:HTTPCommands=  HTTPCommands.Login ;
        const body:any = {UserID, password, AuthenticationString:''} ; 
        const JsonBody = (await this.CreateHTTPRequest(Command,body, UserID)).data;
        const LoginResult:LoginReturn = JsonBody;
        this.UserID = LoginResult.ReturnProfile?.id ?? 'NullLogin';
        this.AuthenticationString = LoginResult.AuthenticationString ?? '';
        return LoginResult;
        
    }
    /**Attempt to logout the user*/
    async LogOut(UserID?:string, Authentication?:string):Promise<ResultReturnCheck>{
        const body:any =this.AuthenticationString;
        const Command:HTTPCommands=  HTTPCommands.LogOut;
        const JsonBody:ResultReturnCheck = (await this.CreateHTTPRequest(Command,body, this.UserID)).data
        return JsonBody;
    }

    async CheckManagerPermissions(): Promise<ResultReturnCheck> {
        const Command:HTTPCommands=  HTTPCommands.CheckManagerPermissions
        let body = {}
        let result:ResultReturnCheck;
        try {
            result = (await this.CreateHTTPRequest(Command, body, this.UserID)).data
        } catch (error) {
            result = {ResultCheck:false}
        }
        return result
    }
    async CheckAdminPermissions(): Promise<ResultReturnCheck> {
        const Command:HTTPCommands=  HTTPCommands.CheckAdminPermissions
        let body = {}
        let result:ResultReturnCheck;
        try {
            result = (await this.CreateHTTPRequest(Command, body, this.UserID)).data
        } catch (error) {
            result = {ResultCheck:false}
        }
        return result
    }
    
    async AdminGetAllEmployees():Promise<TransferProfileArray>{
        const Command:HTTPCommands=  HTTPCommands.AdminGetAllEmployees;
        const body={AuthenticationString: (this.AuthenticationString)};
        const ReturnProfileArray:TransferProfileArray= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnProfileArray;
    }
    async AdminAssignManager(EmployeeID:string, ManagerID:string):Promise<ResultReturnCheck>{
        const Command:HTTPCommands=  HTTPCommands.AdminAssignManager;
        const body={EmployeeID, ManagerID,AuthenticationString: (this.AuthenticationString)};
        const ReturnResultCheck:ResultReturnCheck= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnResultCheck;
    }
    async AdminRemoveEmployeeAssignment(EmployeeID:string, ManagerID:string, AdminID:string):Promise<ResultReturnCheck> {
        const Command:HTTPCommands=  HTTPCommands.AdminRemoveEmployee;
        const body={EmployeeID, ManagerID,AuthenticationString: (this.AuthenticationString)};
        const ReturnResultCheck:ResultReturnCheck= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnResultCheck;
    }
    async AdminDeleteProfile(EmployeeID:string):Promise<ResultReturnCheck>  {
        const Command:HTTPCommands=  HTTPCommands.AdminDeleteProfile;
        const body={EmployeeID,AuthenticationString: (this.AuthenticationString)};
        const ReturnResultCheck:ResultReturnCheck= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnResultCheck;
    }
    async AdminCreateProfile(ProfileInit: HTTPCreateProfile, ManagerID: string): Promise<TransferProfile> {
        const Command:HTTPCommands=  HTTPCommands.AdminCreateProfile;
        const body={ProfileInit,ManagerID,AuthenticationString: (this.AuthenticationString)};
        const ReturnProfile:TransferProfile= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnProfile;
    }
    // Manager functions==================================================================
    async ManagerChangeRequest(ManagerID:string, RequestID:string, Type:RequestStatus, Message:string):Promise<TransferRequest> {
        const Command:HTTPCommands=  HTTPCommands.ManageChangeRequest;
        let body:ResultReturnMarkRequest ;
        switch(Type){
            case RequestStatus.Denied:    { body= { ReturnString:RequestID, Type:RequestStatus.Denied, AuthenticationString: (this.AuthenticationString),Message}; break }
            case RequestStatus.Approved:    {body= { ReturnString:RequestID, Type:RequestStatus.Approved, AuthenticationString: (this.AuthenticationString),Message}; break }
            default:   {  body= { ReturnString:RequestID, Type:RequestStatus.Pending, AuthenticationString: (this.AuthenticationString),Message} ; break }
        }
        const ResultReturnRequest:TransferRequest = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ResultReturnRequest;
    }
    async ManagerGetAllRequest(ManagerID:string,Type:RequestStatus):Promise<TransferRequestArray> {
        const Command:HTTPCommands=  HTTPCommands.ManagerGetAllRequest ;
        const body ={}
        let ResultReturnRequest:TransferRequestArray= (await this.CreateHTTPRequest(Command, body, `${this.UserID}/${Type}/${this.AuthenticationString}`)).data;
        return ResultReturnRequest
    }
    async ManagerGetRecords(): Promise<TransferRecords> {
        const Command:HTTPCommands=  HTTPCommands.GetRecords ;
        const body={};
        const ReturnRecord:TransferRecords= (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ReturnRecord;
    }
    /**Used to initialize a new account and also login the user*/
    async CreateProfile(ProfileInit:HTTPCreateProfile):Promise<LoginReturn> {
        const Command:HTTPCommands=  HTTPCommands.CreateProfile ;
        const body:HTTPCreateProfile = {... ProfileInit} ; 
        const LoginFound:LoginReturn = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        this.UserID = LoginFound.ReturnProfile.id ?? ''
        this.AuthenticationString = LoginFound.AuthenticationString?? ''
        return LoginFound;
    }
    /**Used to change first name*/
    async ChangeFirstName( NewFirstName:string, EmployeeID?:string):Promise<ResultReturnString> {
        const Command:HTTPCommands=  HTTPCommands.ChangeFirstName ;
        const body:ResultReturnStringID = {ReturnString:NewFirstName, AuthenticationString: (this.AuthenticationString) }
        const ResultReturnString:ResultReturnString = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ResultReturnString;
    }
    /**Use tp change last name*/
    async ChangeLastName( NewLastName:string, EmployeeID?:string):Promise<ResultReturnString> {
        const Command:HTTPCommands=  HTTPCommands.ChangeLastName ;
        const body:ResultReturnStringID = {ReturnString: NewLastName, AuthenticationString: (this.AuthenticationString) }
        const ResultReturnString:ResultReturnString = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ResultReturnString;
    }
    /**Used to change password*/
    async ChangePassword(NewPassword:string, EmployeeID?:string):Promise<ResultReturnString> {
        const Command:HTTPCommands=  HTTPCommands.ChangeLastName ;
        const body:ResultReturnStringID = {ReturnString: NewPassword, AuthenticationString: (this.AuthenticationString) }
        const ResultReturnString:ResultReturnString = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ResultReturnString;
    }
    /**Use to get manager name*/
    async GetManagerName(ManagerID:string):Promise<ResultReturnString> {
        const Command:HTTPCommands=  HTTPCommands.GetManageName;
        const body={}
        const ResultReturnString:ResultReturnString = (await this.CreateHTTPRequest(Command, body, `${this.UserID}/Manager/${ManagerID}`)).data;
        return ResultReturnString;
    }
    async MakeRequest(EmployeeID:string, Amount:number, Message:string):Promise<TransferRequest> {
        const Command:HTTPCommands=  HTTPCommands.MakeRequest ;
        const body:MakeRequestForm = {Amount, Message, AuthenticationString: (this.AuthenticationString)}
        const ResultReturnRequest:TransferRequest = (await this.CreateHTTPRequest(Command, body, this.UserID)).data;
        return ResultReturnRequest;
    }/**use to mark a request s deleted*/
    async DeleteRequest(EmployeeID:string, RequestID:string):Promise<ResultReturnCheck> {
        const Command:HTTPCommands=  HTTPCommands.DeleteRequest;
        const authenticationString = this.AuthenticationString
        const ResultReturn:ResultReturnCheck = (await this.CreateHTTPRequest(Command, {}, `${this.UserID}/${authenticationString}/${RequestID}`)).data;
        return ResultReturn;
    }
    async GetAllSentRequestOfType(IDstring:string, Type:RequestStatus):Promise<TransferRequestArray> {
        const Command:HTTPCommands=  HTTPCommands.GetAllSentRequest ;
        const body ={}
        let responseData:any =(await this.CreateHTTPRequest(Command, body, `${this.UserID}/${this.AuthenticationString}/${Type}`)).data
        const ResultReturnRequest:TransferRequestArray = responseData

        return ResultReturnRequest;
    }

}