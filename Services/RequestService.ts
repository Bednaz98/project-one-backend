import DAOWrapper from "../DAOClasses/DAOWrapper";
import DataProcessor from "../Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import ThrowServerError from "../Project1-GitUtil-Reimbursement/Classes/ServerErrorClass";
import { ResultReturnCheck, TransferRecords, TransferRequest, TransferRequestArray } from "../Project1-GitUtil-Reimbursement/Types/dto";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag, RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { ManagerHTTPCLInterface } from "../Project1-GitUtil-Reimbursement/Types/HTTPCommands";
import DAOCheckManager from "./DAOCheckService";
import Logger from "./ServerLogger";


export default class RequestServices implements ManagerHTTPCLInterface{
    private DAOClass: DAOWrapper;
    private Proc:DataProcessor;
    private Checker:DAOCheckManager;
    private DebugLog:Logger;
    constructor(InitDAO:DAOWrapper, InitDataProcessor:DataProcessor,InitDAOCheck:DAOCheckManager, InitDebugLog:Logger ){
        this.DAOClass=InitDAO;
        this.Proc=InitDataProcessor
        this.Checker=InitDAOCheck
        this.DebugLog = InitDebugLog
    }
    async ManagerGetRecords(): Promise<TransferRecords> {
        await this.DebugLog.print('Service Get All Manager getting records',0);
        const profileArray = await this.DAOClass.GetAllProfiles();
        const requestArray = await this.DAOClass.GetAllRequest();
        let ReturnArray:string[] = [];
        for(let i =0; i <profileArray.length;i++ ){
            let sum:number =0;
            for(let j =0; j <requestArray.length; j++ ){
                if(requestArray[j].RequestStatus != RequestStatus.deleted){
                    let extract = this.Proc.ExtractRequestIDs(requestArray[j].id);
                    if(extract[1] ===profileArray[i].id ){sum+= Number(requestArray[j].Amount)}
                }
            
            }
            ReturnArray.push(`${profileArray[i].FirstName} ${profileArray[i].LastName}: ${sum}` )
        }
        const Transfer:TransferRecords= { ReturnRecords: ReturnArray};
        return Transfer;
    }

    async ManagerChangeRequest(ManagerID:string, RequestID:string,Type:RequestStatus,Message:string  ):Promise<TransferRequest> {
        this.DebugLog.print('Service Mark Request called',0)
        // tries to check the DAO for this manager
        const FoundManager:Profile = await this.DAOClass.GetSingleProfile(ManagerID)
        // returns an error if not found
        //if(! FoundManager){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        // checks to see if they have any manager privileges
        //if(! this.Checker.IsManger(FoundManager) ){ ThrowServerError(HTTPRequestErrorFlag.NotAManager) }
        // checks to see if this manager has permissions to access this request
        const HasPermission:boolean = (this.Proc.ExtractRequestIDs(RequestID)).includes(FoundManager.id);
        //if(!HasPermission){ ThrowServerError(HTTPRequestErrorFlag.ManagerNotValidPrivileges) }
        // Checks to see if the manager is using invalid marking status
        //if(Type == RequestStatus.deleted){ ThrowServerError(HTTPRequestErrorFlag.RequestManagerDeleteError) }
        //if(Type == RequestStatus.All){ ThrowServerError(HTTPRequestErrorFlag.RequestManagerInvalidType) }
        // tries to find the request
        const FoundRequest:Request = await this.DAOClass.GetSingleRequest(RequestID);
        FoundRequest.ManagerMessage=Message;
        //if(!FoundRequest){ ThrowServerError(HTTPRequestErrorFlag.RequestNotFound) }
        // report an error if the request was already changed from pending
        //if(FoundRequest.RequestStatus !== RequestStatus.Pending){ ThrowServerError(HTTPRequestErrorFlag.RequestChangeStatusError) }
        //Mark and update request
        FoundRequest.RequestStatus = Type;
        const IntermediateRequest:Request = await this.DAOClass.UpdateRequest(FoundRequest);
        //Mark Request
        IntermediateRequest.RequestStatus = Type;
        //Update Modified time
        IntermediateRequest.ModifiedDate = Date.now() ;
        //write request to the DAO
        const ReturnRequest:Request = await this.DAOClass.UpdateRequest(IntermediateRequest);
        //if(!ReturnRequest){ ThrowServerError(HTTPRequestErrorFlag.RequestUpdateError) }
        // finally returns the request that is updated
        this.DebugLog.print('Service returning request changed',0)
        return {ReturnRequest:ReturnRequest};
    }

    private async GetAllSentRequest(EmployeeID:string): Promise<Request[]> {
        await this.DebugLog.print('Service Get all request called',0)
        // Checks to see if the profile is exist
        const FoundProfile:Profile = await this.DAOClass.GetSingleProfile(EmployeeID);
        this.DebugLog.print('Service all request, profile found',0)
        //if(!FoundProfile){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        //Gets all the request from the server  ### ?? Not sure which is better, getting the employee array and might cost more with a few dose request, this could require a lot of processing as time grows ??
        const AllRequest:Request[] = await this.DAOClass.GetAllRequest();
        this.DebugLog.print('Service all request, All request retrieved',0)
        // Filter the request for this employee, already manages security
        let filteredArray:Request[]=[]
        for(let i =0; i < AllRequest.length ;i++){
            if(AllRequest[i].RequestStatus !== RequestStatus.deleted ){ filteredArray.push( AllRequest[i] ) }
        }
        this.DebugLog.print('Service all request, filtering request',0)
        const RequestFound:Request[] = this.Proc.FilterRequestByID(FoundProfile.id, false,filteredArray )
        this.DebugLog.print('Service returning all request',0)
        return RequestFound;
    }
    async ManagerGetAllRequest(ManagerID:string):Promise<TransferRequestArray>{
        await this.DebugLog.print('Service Get All Manager request called',0)
        const Check = await this.CheckAdminPermissions(ManagerID)
        if(Check.ResultCheck){
            const AllRequest:Request[] = await this.DAOClass.GetAllRequest();
            const Transfer:TransferRequestArray = {ReturnRequestArray: AllRequest}
        }
        else{
            const FoundArray:Request[] = await this.GetAllSentRequest(ManagerID)
            const Transfer:TransferRequestArray = {ReturnRequestArray: FoundArray }
            await this.DebugLog.print(`Service Get All Manager request return, Total: ${Transfer.ReturnRequestArray.length}`,0);
            return Transfer;}
    }

    async CheckManagerPermissions(ID:string):Promise<ResultReturnCheck> {
        await this.DebugLog.print('Service checking manager permissions',0);
        const FoundProfile = await this.DAOClass.GetSingleProfile(ID)
        //if(!FoundProfile){    }
        const check = await this.Checker.IsManger(FoundProfile)
        const ReturnResult:ResultReturnCheck = { ResultCheck: check }
        await this.DebugLog.print(`service returning result`,0);
        return ReturnResult;
    }

    async CheckAdminPermissions(ID:string):Promise<ResultReturnCheck>{
        await this.DebugLog.print('Service Admin manager permissions',0);
        const FoundProfile = await this.DAOClass.GetSingleProfile(ID)
        //if(!FoundProfile){    }
        const check = await this.Checker.IsAdmin(FoundProfile)
        const ReturnResult:ResultReturnCheck = { ResultCheck: check }
        await this.DebugLog.print(`service returning result`,0);
        return ReturnResult;
    }
}