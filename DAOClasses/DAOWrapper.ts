import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import DAOInterface from "./DAOInterface";
import VirtualDAO from "./VirtualDAO";
import LocalDAO from './LocalDAO'
import CosmosDAO from "./CosmosDAO";
import EncryptionSys from "../Services/EncryptService";
import Logger from "../Services/ServerLogger";

/**this is used as a wrapper to switch which database is being used*/
export default class DAOWrapper implements DAOInterface{
    private DAOClass:any;
    private Encrpt:EncryptionSys = new EncryptionSys ();
    private DebugLog:Logger;
    constructor(Setting:number, InitLogger:Logger){
        this.DebugLog = InitLogger;
        switch(Setting){
            case    0:{ this.DAOClass = new VirtualDAO(InitLogger);break}// console.log('using VDAO')}
            case    1:{ this.DAOClass = new LocalDAO(InitLogger);break}// console.log('using LocalDAO')}
            case    2:{ this.DAOClass = new CosmosDAO(InitLogger);break}// console.log('using ComosDAO')}
            default  :{ this.DAOClass = new VirtualDAO(InitLogger);break}// console.log('Wrapper using DEFAULT DAO')}
        }
    }

    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        await this.DebugLog.print('wrapper called create profile');
        const result = await this.DAOClass.CreateProfile(InputProfile);
        return result;
    }
    async GetSingleProfile(ProfileID: string): Promise<Profile> {
        await this.DebugLog.print('wrapper called Get Single Profile');
        const  result= await this.DAOClass.GetSingleProfile(ProfileID);
        return  result;
    }
    async GetAllProfiles(): Promise<Profile[]> {
        await this.DebugLog.print('wrapper called Get all Profiles')
        const ProfileArray:Profile[] = await this.DAOClass.GetAllProfiles();
        return ProfileArray
    }

    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        await this.DebugLog.print('wrapper called Update Profile')
        const result = await this.DAOClass.UpdateProfile(InputProfile);
        return result;
    }
    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        await this.DebugLog.print('wrapper called Delete profile')
        const result = await this.DAOClass.DeleteProfile(InputProfile);
        return result;
    }
    async CreateRequest(InputRequest: Request): Promise<Request> {
        await this.DebugLog.print('wrapper called create request');
        const result = await this.DAOClass. CreateRequest(InputRequest);
        return result;
    }
    async GetSingleRequest(RequestID: string): Promise<Request> {
        await this.DebugLog.print('wrapper called get single request');
        const result = await this.DAOClass.GetSingleRequest(RequestID);
        return result;
    }
    async GetAllRequest(): Promise<Request[]> {
        await this.DebugLog.print('wrapper called get all request');
        const result = await this.DAOClass.GetAllRequest();
        return result;
    }
    async UpdateRequest(InputRequest: Request): Promise<Request> {
        await this.DebugLog.print('wrapper called update request');
        const result = await this.DAOClass.UpdateRequest(InputRequest);
        return result;
    }
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        await this.DebugLog.print('wrapper called delete request');
        const result = await this.DAOClass.DeleteRequest(InputRequest);
        return result;
    }

    WhichDao():number{
        if(this.DAOClass instanceof VirtualDAO){ return 0}
        else if(this.DAOClass instanceof LocalDAO){ return 1}
        else if(this.DAOClass instanceof CosmosDAO){ return 2}
        else return -1;
        }
}