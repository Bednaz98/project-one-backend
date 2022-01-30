import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import { RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import Logger from "../Services/ServerLogger";
import DAOInterface from "./DAOInterface";


export default class VDAO implements DAOInterface{

    private ProfileArray:Profile[] = [];
    private RequestArray:Request[] = [];
    private DebugLog:Logger;
    constructor(InitLog:Logger){
        this.DebugLog = InitLog
    }

    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        for(let i =0; i <this.ProfileArray.length ;i++ ){
            if(this.ProfileArray[i]?.id === InputProfile.id){ 
                await this.DebugLog.print('VDAO returning undefine, found profile')
                return undefined}
        }
        this.ProfileArray.push(InputProfile)
        await this.DebugLog.print('VDAO returning created profile')
        return this.ProfileArray[ this.ProfileArray.length-1 ]
    }
    async GetSingleProfile(ProfileID: string): Promise<Profile> {
        for(let i =0; i <this.ProfileArray.length ;i++ ){
            if(this.ProfileArray[i].id === ProfileID){ await this.DebugLog.print('VDAO returning single profile'); return this.ProfileArray[i]}
        }
        await this.DebugLog.print('VDAO returning undefine profile, profile not found')
        return undefined;
    }
    async GetAllProfiles(): Promise<Profile[]> {
        await this.DebugLog.print('VDAO returning all profiles')
        return this.ProfileArray
    }
    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        for(let i =0; i <this.ProfileArray.length ;i++ ){
            if(this.ProfileArray[i]?.id === InputProfile.id){ 
                this.ProfileArray[i] = InputProfile;
                await this.DebugLog.print('VDAO returning updated profile')
                return this.ProfileArray[i]}
        }
        await this.DebugLog.print('VDAO returning undefine profile, not found')
        return undefined;
    }
    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        for(let i =0; i <this.ProfileArray.length ;i++ ){
            if(this.ProfileArray[i]?.id === InputProfile.id){ 
                this.ProfileArray.splice(i,1);
                await this.DebugLog.print('VDAO deleted success')
                return true
            }
        }
        await this.DebugLog.print('VDAO failed to find profile to delete')
        return false;
    }
    async CreateRequest(InputRequest: Request): Promise<Request> {
        for(let i =0; i <this.RequestArray.length ;i++ ){
            if(this.RequestArray[i].id == InputRequest.id){await this.DebugLog.print('VDAO created request found') ;return undefined}
        }
        this.RequestArray.push(InputRequest)
        await this.DebugLog.print('VDAO returning creatd request') 
        return this.RequestArray[ this.RequestArray.length-1 ]
    }
    async GetSingleRequest(RequestID: string): Promise<Request> {
        for(let i =0; i <this.RequestArray.length ;i++ ){
            if(this.RequestArray[i]?.id === RequestID){ return this.RequestArray[i]}
        }
        await this.DebugLog.print('VDAO returning undefine Request')
        return undefined;
    }
    async GetAllRequest(): Promise<Request[]> {
        await this.DebugLog.print('VDAO returning all request')
        return this.RequestArray;
    }
    async UpdateRequest(InputRequest: Request): Promise<Request> {
        for(let i =0; i <this.RequestArray.length ;i++ ){
            if(this.RequestArray[i]?.id === InputRequest.id){ 
                this.RequestArray[i] = InputRequest;
                await this.DebugLog.print('VDAO returning updated request')
                return this.RequestArray[i]}
        }
        await this.DebugLog.print('VDAO returning undefine Request')
        return undefined;
    }
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        await this.DebugLog.print('VDAO delete called');
        for(let i =0; i < this.RequestArray.length ;i++ ){
            if(this.RequestArray[i]?.id == InputRequest.id){ 
                this.RequestArray[i].RequestStatus = RequestStatus.deleted
                await this.DebugLog.print('VDAO delete found request');
                return true
            }
        }
        await this.DebugLog.print('VDAO Delete Request not found');
        return false
    }
}