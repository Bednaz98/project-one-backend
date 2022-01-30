import { HTTPRequestErrorFlag } from "../Types/Enums";
import DataProcessor from "./DataProcessor";

// ######### ERROR MESSAGE NOT FINISHED #################################
export default function ThrowServerError(type:HTTPRequestErrorFlag){
    // if(!type){type = HTTPRequestErrorFlag.Unknown}
    // const e:ServerError = new ServerError('',type)
    // throw e;
}

export class ServerError extends Error{
    errorType!:HTTPRequestErrorFlag;
    timeStamp!:number;
    constructor(message:string,type:HTTPRequestErrorFlag){
        super(message);
        this.errorType =  type;
        this.SetErrorMessage()
        this.timeStamp = Math.round(Date.now() / 1000);
    }

    public SetErrorMessage(){
        const Proc:DataProcessor = new DataProcessor()
        //throw new Error('Error Messages not finished')
        
        switch (this.errorType){
            case /*NameToShort*/HTTPRequestErrorFlag.NameToShort: {
                this.message = `This name is too short, please input a name longer than ${Proc.GetValidNameLength()} characters`; break }
            case /*NameCharError*/HTTPRequestErrorFlag.NameCharError: {
                this.message = `Your name can not include the following characters: ${Proc.GetInvalidNamingCharacters().join()}`; break}
            case/*PasswordInitError*/HTTPRequestErrorFlag.PasswordInitError:{
                this.message = `This password is too short, please input a name longer than ${Proc.GetPasswordLength()} characters`; break}
            case /*InitManagerNotExist*/HTTPRequestErrorFlag.InitManagerNotExist:{
                this.message = `The manager you specified does not exist in the data base`; break}
            case /*InitEmployeeError*/HTTPRequestErrorFlag.InitEmployeeError:{
                this.message ='One or more employee you entered does not exist in our database'; break}
            case /*ProfileServerCreationError*/HTTPRequestErrorFlag.ProfileServerCreationError:{
                this.message ='There was an error trying to create your profile caused by the database'; break}
            case /*ProfileAlreadyExist*/HTTPRequestErrorFlag.ProfileAlreadyExist:{
                this.message ='It seems this profile is already registered in our database, call an administrator for help'; break}
            case /*ManagerNameNotFound */HTTPRequestErrorFlag.ManagerNameNotFound:{
                this.message ='The Manager you requested is not found'; break}
            case /*NotAManager*/HTTPRequestErrorFlag.NotAManager:{
                this.message ='The Employee you are looking at is not a manager'; break}
            case /*EmployeeNotFoundGeneral*/HTTPRequestErrorFlag.EmployeeNotFoundGeneral:{
                this.message ='Employee not found in the Database'; break}
            default:{this.message = `No error initialized` ; break}
        }
    }
}