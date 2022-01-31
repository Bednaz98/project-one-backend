import { HTTPCreateProfile, Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { ProfileHTTPCInterface } from "../Project1-GitUtil-Reimbursement/Types/HTTPCommands";
import DataProcessor from "../Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import ThrowServerError, { ServerError } from "../Project1-GitUtil-Reimbursement/Classes/ServerErrorClass";
import DAOCheckManager from "./DAOCheckService";
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import RequestBuilder from "../Project1-GitUtil-Reimbursement/Classes/RequestBuilder";
import { HTTPRequestErrorFlag } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import DAOWrapper from "../DAOClasses/DAOWrapper";
import Logger from "./ServerLogger";
import { LoginReturn, ResultReturnCheck, ResultReturnString, TransferProfile, TransferRequest, TransferRequestArray } from "../Project1-GitUtil-Reimbursement/Types/dto";

/**This class is used as an mediator between an incoming HTTP request and the DAO. It performs all data verification before trying to trave anything to the DAO*/
export default class ProfileService implements ProfileHTTPCInterface{
    private DAOClass: DAOWrapper;
    private Proc:DataProcessor;
    private Checker:DAOCheckManager;
    private DebugLog:Logger;
    constructor(InitDAOClass:DAOWrapper,InitProc:DataProcessor, InitDAOCheck:DAOCheckManager, InitDebugLog:Logger){
        this.DAOClass=InitDAOClass
        this.Proc = InitProc;
        this.Checker =InitDAOCheck;
        this.DebugLog= InitDebugLog;
    }

    /**Used to create a profile that was received from an HTTP request*/
    async CreateProfile(ProfileInit:HTTPCreateProfile):Promise<LoginReturn>{
        await this.DebugLog.print('Service Creating Profile',0)
        // Checks that do not require any DAO calls
        // if      (! this.Proc.ValidNameLengthCheck(  ProfileInit.FirstName  )){  console.log('error thrown');ThrowServerError(HTTPRequestErrorFlag.NameToShort)}
        // if (! this.Proc.ValidCharacterCheck(  ProfileInit.FirstName  )){ ThrowServerError(HTTPRequestErrorFlag.NameCharError) }
        // if (! this.Proc.ValidCharacterCheck(  ProfileInit.LastName  )){ ThrowServerError(HTTPRequestErrorFlag.NameCharError) }
        // else if (! this.Proc.ValidNameLengthCheck(  ProfileInit.LastName  )){ ThrowServerError(HTTPRequestErrorFlag.NameToShort) }
        // else if (! this.Proc.PasswordValidation(  ProfileInit.Password  )){ ThrowServerError(HTTPRequestErrorFlag.PasswordInitError) }
        // constructs full profile
        const TempProfile:Profile = {FirstName:ProfileInit.FirstName, LastName:ProfileInit.LastName,Password:ProfileInit.Password ,id:ProfileInit.id }
        const NewProfile:Profile= (new ProfileManager(TempProfile)).DeconstructProfile()

        //DAO calls, at a minium to ensure a profile is created correctly.==================
        // checks the DAO to see if this profile is already taken
        await this.DebugLog.print('Service Creating Profile: Duplication check')
        //if(await this.Checker.EmployeeExist( NewProfile.id ) ){ThrowServerError(HTTPRequestErrorFlag.ProfileAlreadyExist) }
        // // Check to see if the manager exist
        // else if (! await this.Checker.IsManger( ProfileInit ) ){ ThrowServerError(HTTPRequestErrorFlag.InitManagerNotExist) }
        // // check to see if all employee assigned exist
        // for(let i=0; 0 <ProfileInit.EmployeeArray.length; i++ ){
        //     if(! await this.Checker.EmployeeExist(ProfileInit.EmployeeArray[i]) ){ThrowServerError(HTTPRequestErrorFlag.InitEmployeeError) }
        // }
        /*======================================================================================*/

        // try to write profile to the DAO
        await this.DebugLog.print('Service Creating Profile: Writing to DAO',0)
        const ReturnProfile = await this.DAOClass.CreateProfile(NewProfile)
        //Last check to see if this return profile is truthy
        if(ReturnProfile){ await this.DebugLog.print('Service Creating Profile: Service complete',0); return {ReturnProfile,AuthenticationString:'', password:''}}
        else {  this.DebugLog.print('Service Creating Profile: Server Error',0) ;ThrowServerError(HTTPRequestErrorFlag.ProfileServerCreationError)}
    }
    /**Used to change the first name of a profile received from an HTTP request*/
    async ChangeFirstName(EmployeeID:string, NewFirstName:string):Promise<ResultReturnString> {
        await this.DebugLog.print('Service Change First name called',0)
        // if(! this.Proc.ValidNameLengthCheck(  NewFirstName )){ ThrowServerError(HTTPRequestErrorFlag.NameToShort)}
        // else if (! this.Proc.ValidCharacterCheck(  NewFirstName  )){ ThrowServerError(HTTPRequestErrorFlag.NameCharError) }
        await this.DebugLog.print('Service first name change getting employee',0)
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID)
        FoundProfile.FirstName = NewFirstName;
        // check to make sure the DAO returns properly
        await this.DebugLog.print('Service first name change writing to DAO ',0)
        const ReturnName:string= (await  this.DAOClass.UpdateProfile(FoundProfile)).FirstName; 
        if(ReturnName){await this.DebugLog.print('Return first name',0); return {ReturnString:ReturnName} }
        else {await this.DebugLog.print('Service error update',0); ThrowServerError(HTTPRequestErrorFlag.ProfileUpdateError)}
    }
    /**Used to change the last name of a profile received from an HTTP request*/
    async ChangeLastName(EmployeeID:string, NewLastName:string):Promise<ResultReturnString>{
        await this.DebugLog.print('Service Change last name',0)
        // if(! this.Proc.ValidNameLengthCheck(  NewLastName)){ ThrowServerError(HTTPRequestErrorFlag.NameToShort)}
        // else if (! this.Proc.ValidCharacterCheck(  NewLastName  )){ ThrowServerError(HTTPRequestErrorFlag.NameCharError) }
        await this.DebugLog.print('Service finding employee',0)
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID)
        FoundProfile.LastName = NewLastName;
        // check to make sure the DAO returns properly
        if(FoundProfile){ await this.DebugLog.print('Service return last name',0); return { ReturnString:(await this.DAOClass.UpdateProfile(FoundProfile)).LastName} }
        else { await this.DebugLog.print('Service error update',0) ;ThrowServerError(HTTPRequestErrorFlag.ProfileUpdateError)}
    }

    /**Used to change the password of a profile received from an HTTP request*/
    async ChangePassword(EmployeeID:string, NewPassword:string):Promise<ResultReturnString>{
        await this.DebugLog.print('Service Change password',0)
        // if(! this.Proc.PasswordValidation(  NewPassword)){ ThrowServerError(HTTPRequestErrorFlag.PasswordInitError)}
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID)
        FoundProfile.Password = NewPassword;
        // check to make sure the DAO returns properly
        if(FoundProfile){ this.DebugLog.print('Service Change password',0); return { ReturnString:(await this.DAOClass.UpdateProfile(FoundProfile)).Password }}
        else {ThrowServerError(HTTPRequestErrorFlag.ProfileUpdateError)}
    }

    /**Used to retrieve the name a manager giving a specific ID*/
    async GetManagerName(ManagerID:string):Promise<ResultReturnString> {
        await this.DebugLog.print(`Service Get manager name ${ManagerID}`,0)
            const ReturnProfile = await this.DAOClass.GetSingleProfile(ManagerID)
            //if(! ReturnProfile){ await this.DebugLog.print('Service Employee search not exist',0); ThrowServerError( HTTPRequestErrorFlag.ManagerNameNotFound  ) }
            //if(! await this.Checker.IsManger( (ReturnProfile) ) ) {await this.DebugLog.print('Service Employee not a manager',0); ThrowServerError(HTTPRequestErrorFlag.NotAManager);}
             //{
                const {FirstName, LastName} = ReturnProfile
                await this.DebugLog.print('Service return manager name',0)
                return {ReturnString:`${FirstName} ${LastName}`}
            //}
    }

    async MakeRequest(EmployeeID:string, Amount:number, Message:string):Promise<TransferRequest> {
        await this.DebugLog.print('Service Make Request',0)
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID);
        await this.DebugLog.print('Service profile found',0)
        // if(! FoundProfile){ ThrowServerError( HTTPRequestErrorFlag.EmployeeNotFoundGeneral )}
        //const FoundManager:Profile = await this.DAOClass.GetSingleProfile(FoundProfile.ManagerID)
        // if(! await this.Checker.IsManger( (FoundManager) ) ) { ThrowServerError(HTTPRequestErrorFlag.NotAManager) }
        // else {
        const TempRequest:RequestBuilder = new RequestBuilder( FoundProfile.ManagerID, FoundProfile.id, Amount  );
        await this.DebugLog.print('Service Request Build',0)
        if(Message?.length >0){await this.DebugLog.print('Service attaching message',0); TempRequest.AttachInputMessage(Message)}
        const DAOReturnRequest:Request = await this.DAOClass.CreateRequest(TempRequest.DeconstructRequest())
        await this.DebugLog.print('Service attaching message',0)
        if(! DAOReturnRequest){ ThrowServerError(HTTPRequestErrorFlag.RequestCreationError); }
        await this.DebugLog.print('Service return created request',0)
        return {ReturnRequest:DAOReturnRequest};
        // }
    }

    /**Used to mark a 'request of ID' as deleted by an 'employee of ID'*/
    async DeleteRequest(EmployeeID:string, RequestID:string):Promise<ResultReturnCheck> {
        await this.DebugLog.print('Service try mark as delete',0)
        // First Find the Employee on the DAO
        this.DebugLog.print('Service delete, getting profile',0)
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID);
        // if(!FoundProfile){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        this.DebugLog.print(`Service Delete, Profile Found: [${FoundProfile.id}]`,0)

        // Check if the employee has access to the Request in question 
        this.DebugLog.print(`Service delete, Check Request Access: [${EmployeeID}] => [${RequestID}]`,0)
        //const ReturnRequest:Request = await this.Checker.CheckRequestAccess(EmployeeID,RequestID);
        const ReturnRequest:Request = await this.DAOClass.GetSingleRequest(RequestID)
        this.DebugLog.print(`Service delete, Request found: [${ReturnRequest.id}]`,0)
        // if( !ReturnRequest ){ ThrowServerError(HTTPRequestErrorFlag.EmployeeRequestAccessError) }
        // if(ReturnRequest.RequestStatus !== RequestStatus.Pending){ ThrowServerError(HTTPRequestErrorFlag.RequestChangeStatusError) }

        

        // Try to mark the request as deleted, but does not actually delete the request
        this.DebugLog.print('Service delete, calling DAO deletion',0)
        const Deleted:boolean = await this.DAOClass.DeleteRequest(ReturnRequest)
        // if(!Deleted){ ThrowServerError(HTTPRequestErrorFlag.RequestDeletionError) }

        // remove the request from the profile listing
        this.DebugLog.print('Service delete, Remove request from profile',0)
        const RequestIndex:number = FoundProfile.EmployeeArray.indexOf(ReturnRequest.id)
        FoundProfile.SendRequestIDArray = FoundProfile.EmployeeArray.splice(RequestIndex,RequestIndex)

        // Try to update the profile with the request removed
        this.DebugLog.print('Service delete, updating profile',0)
        const UpdatedProfile:Profile =  await this.DAOClass.UpdateProfile(FoundProfile)
        // if(! UpdatedProfile){ ThrowServerError(HTTPRequestErrorFlag.ProfileUpdateError)  }

        // All tasks complete, now we can return
        this.DebugLog.print('Service returning delete notify: true',0)
        return {ResultCheck:true}
    }

    /**Used to recover all request this employee has access to*/ // This is marked as private because it does not filter based on admin privileges
    private async GetAllSentRequest(EmployeeID:string): Promise<Request[]> {
        throw new Error('not implemented')
    }

    /** Used to filter request of a specific type*/
    async GetAllSentRequestOfType(IDstring:string, Type:RequestStatus):Promise<TransferRequestArray>{
        await this.DebugLog.print(`Service Get all request called, => ${Type}`,0)
        //grabs the profile from the DAO
        const ReturnProfile:Profile = await this.DAOClass.GetSingleProfile(IDstring);
        await this.DebugLog.print('ServiceGet all request of type, found profile',0)
        const RequestArray:Request[] = await this.DAOClass.GetAllRequest()
        await this.DebugLog.print(`ServiceGet all request of type, all request found, Total: ${RequestArray.length}`,0)
        if(! (RequestArray.length >0) ){await this.DebugLog.print('ServiceGet all request of type, No request in database',0); return {ReturnRequestArray:[]}}
        const IsAdmin:boolean = await this.Checker.IsAdmin(ReturnProfile)
        await this.DebugLog.print(`ServiceGet all request of type, admin privileges check: ${IsAdmin}`,0)
        let FilteredArray:Request[] =[]
        for(let i =0; i <RequestArray.length; i++ ){
            let IDArray = this.Proc.ExtractRequestIDs(RequestArray[i].id)
            if(RequestArray[i].RequestStatus !==RequestStatus.deleted && IDArray[1] == IDstring){
                FilteredArray.push(RequestArray[i] )
            }
        }

        switch(Type){
            case RequestStatus.All:{
                await this.DebugLog.print(`ServiceGet all request of type, Filter process: {ALL}`,0);
                return {ReturnRequestArray:FilteredArray};
            }
            default:{
                await this.DebugLog.print(`ServiceGet all request of type, Filter process: ~${Type}`,0);
                // for all other request, grab a specific one
                let ReturnRequestArray:Request[] =[];
                for(let i =0; i < FilteredArray.length; i++ ){
                    //only add to the stack if it is the type requested
                    if( (FilteredArray[i].RequestStatus === Type)){ 
                        ReturnRequestArray.push( FilteredArray[i] ) }
                }
                // Return the filtered request
                const Transfer:TransferRequestArray = {ReturnRequestArray:ReturnRequestArray}
                this.DebugLog.print(`Service return request of type, Total: ${Transfer.ReturnRequestArray.length}`,0)
                return Transfer;
            }
        }
    }
}
