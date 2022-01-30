import DAOWrapper from "../DAOClasses/DAOWrapper";
import ThrowServerError from "../Project1-GitUtil-Reimbursement/Classes/ServerErrorClass";
import { Profile } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { LogHTTPCInterface } from "../Project1-GitUtil-Reimbursement/Types/HTTPCommands";
import { v4 } from "uuid";
import { LoginReturn, ResultReturnCheck } from "../Project1-GitUtil-Reimbursement/Types/dto";



export default class LoginService implements LogHTTPCInterface{
    private LogMap = new Map<string, string>([]);
    private DAOClass:DAOWrapper
    constructor(InitDAO:DAOWrapper){
        this.DAOClass = InitDAO;
    }
    async Login(UserID:string, Password):Promise<LoginReturn> {
        const ReturnProfile:Profile =await this.DAOClass.GetSingleProfile(UserID)
        if(!ReturnProfile){ ThrowServerError(HTTPRequestErrorFlag.EmployeeNotFoundGeneral) }
        const AuthenticationString:string = this.CreateCreds(UserID);
        const ReturnLogin: LoginReturn = {ReturnProfile, AuthenticationString, password:'' }
        return ReturnLogin;
    }
    CreateCreds(UserID: string):string{
        if(this.LogMap.has(UserID)) { return this.LogMap.get(UserID) }
        const Authentication:string = v4()
        this.LogMap.set( UserID, Authentication)
        return Authentication;
    }
    CheckCreds(UserID: string, Authentication:string):boolean {
        if(! this.LogMap.has(UserID)){ ThrowServerError(HTTPRequestErrorFlag.AuthenticationNotFound) }
        if(! (this.LogMap.get(UserID) === Authentication) ){ThrowServerError(HTTPRequestErrorFlag.AuthenticationStringError)}
        return true;
    }
    
    async LogOut(UserID:string, Authentication:string):Promise<ResultReturnCheck>{
        if(! this.LogMap.has(UserID)){ ThrowServerError(HTTPRequestErrorFlag.AuthenticationNotFound) }
        if(! (this.LogMap.get(UserID) === Authentication) ){ThrowServerError(HTTPRequestErrorFlag.AuthenticationStringError)}
        const check = this.LogMap.delete(UserID);
        return {ResultCheck:check};
    }

}