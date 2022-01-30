import DAOWrapper from "../DAOClasses/DAOWrapper";
import DataProcessor from "../Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import Logger from "./ServerLogger";

interface DAOCheck{
    EmployeeExist(EmployeeID:string):Promise<boolean>
    IsManger(EmployeeProfile:Profile):Promise<boolean>
    IsAdmin(EmployeeProfile:Profile):Promise<boolean>
}


export default class DAOCheckManager implements DAOCheck{
    private DAOClass:DAOWrapper;
    private DebugLog:Logger;
    private Proc:DataProcessor;
    constructor(InitDAO:DAOWrapper,InitLogger:Logger,InitProc:DataProcessor){this.DAOClass= InitDAO; this.DebugLog = InitLogger; this.Proc = InitProc}
    
    async IsManger(EmployeeProfile:Profile): Promise<boolean> {
        if(!EmployeeProfile.ManagerID){ await this.DebugLog.print('Admin as Manager'); return true }
        if(Number(EmployeeProfile?.EmployeeArray?.length) > 0){ await this.DebugLog.print('Manager access');return true}
        else { await this.DebugLog.print('No Manager access'); return false}
    }
    async IsAdmin(EmployeeProfile:Profile): Promise<boolean> {
        if(!EmployeeProfile.ManagerID){ await this.DebugLog.print('Admin as Manager'); return true }
        else {await this.DebugLog.print('No admin access');return false}
    }
    async EmployeeExist(EmployeeID:string): Promise<boolean> {
        const Temp:Profile= await this.DAOClass.GetSingleProfile(EmployeeID);
        if(Temp?.id == EmployeeID ){await this.DebugLog.print('employee exist');return true}
        await this.DebugLog.print(`no employee exist ${EmployeeID} `)
        return false;
    }
    async CheckRequestAccess(EmployeeID:string, RequestID:string):Promise<Request>{
        const Temp:Profile= await this.DAOClass.GetSingleProfile(EmployeeID);
        console.log('found Employee Array: ', Temp.SendRequestIDArray , " <<<")
        for(let i =0; i < Temp.SendRequestIDArray.length; i++){
            let IDArray:string[] = this.Proc.ExtractRequestIDs(Temp.SendRequestIDArray[i])
            console.log('splitArray: ', this.Proc.ExtractRequestIDs(Temp.SendRequestIDArray[i]))
            if(IDArray[1] == Temp.id) { 
                await this.DebugLog.print(`Request Access granted  [${Temp.id}] => [${RequestID}]  `);
                const foundRequest:Request = await this.DAOClass.GetSingleRequest(RequestID)
                return foundRequest; 
            }
        }
        await this.DebugLog.print(`Request Access denied ${EmployeeID} >|> [${RequestID}]`); 
        return undefined;
    }
}