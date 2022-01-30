import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import CosmosInteractions from "./DAOInterface"; 
import {readFile, writeFile} from 'fs/promises';
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import RequestManager from "../Project1-GitUtil-Reimbursement/Classes/RequestManager";
import { RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import Logger from "../Services/ServerLogger";


export default class LocalDAO implements CosmosInteractions{
    private DebugLog:Logger;
    constructor(InitLog:Logger){
        this.DebugLog = InitLog
    }
    private ProfileFilePath():string{
        return './DAOClasses/MinorProfileData.json';
    }
    private RequestFilePath():string{
        return './DAOClasses/MinorRequestData.json';
    }

    //Read Data ===========================================
    private async ReadProfileDate():Promise<Profile[]> {
        const DataBuffer: Buffer  = await readFile(this.ProfileFilePath());
        const TempProfiles:Profile[] = JSON.parse(DataBuffer.toString())
        return TempProfiles;
    }
    private async ReadRequestDate():Promise<Request[]> {
        const DataBuffer: Buffer  = await readFile(this.RequestFilePath());
        const TempRequest: Request[] = JSON.parse(DataBuffer.toString())
        return TempRequest;
    }

    //Write Data ==========================================
    private async WriteProfileData(InputData:Profile[]): Promise<boolean>{
        if(InputData.length <1){
            const thing = await writeFile(this.ProfileFilePath(), JSON.stringify([{}]));// (path, data to write)
            return (thing === undefined);
        }
        const thing = await writeFile(this.ProfileFilePath(), JSON.stringify(InputData));// (path, data to write)
        return (thing === undefined);
    }
    private async WriteRequestData(InputData:Request[]): Promise<boolean>{
        if(InputData.length <1){
            const thing = await writeFile(this.RequestFilePath(), JSON.stringify([{}]));// (path, data to write)
            return (thing === undefined);
        }
        const thing = await writeFile(this.RequestFilePath(), JSON.stringify(InputData));// (path, data to write)
        return (thing === undefined);
    }
    //profile management ======================================
    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        const TempPObj:ProfileManager = new ProfileManager(InputProfile)
        const ProfileArray:Profile[] = await this.ReadProfileDate();
        const Temp:number = ProfileArray.push(TempPObj.DeconstructProfile())
        await this.WriteProfileData(ProfileArray);
        return ProfileArray[Temp-1];
    }

    async GetSingleProfile(InputID: string): Promise<Profile> {
        const ProfileArray:Profile[] = await this.ReadProfileDate();
        for(let i =0; i <ProfileArray.length;i++ ){
            if(ProfileArray[i].id === InputID){ return ProfileArray[i]}
        }
    }

    async GetAllProfiles(): Promise<Profile[]> {
        return  await this.ReadProfileDate();
    }

    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        const ProfileArray:Profile[] = await this.ReadProfileDate();
        for(let i =0; i <ProfileArray.length;i++ ){
            if(ProfileArray[i].id === InputProfile.id){ 
                ProfileArray[i]=InputProfile;
                return ProfileArray[i]
            }
        }

    }

    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        let ProfileArray:Profile[] = await this.ReadProfileDate();
        if(ProfileArray.length === 0) {return true}
        for(let i =0; i < ProfileArray.length; i++ ){
            if(ProfileArray[i].id == InputProfile.id){ 
                ProfileArray = ProfileArray.slice(i,i);
                const Complete:boolean = await this.WriteProfileData(ProfileArray)
                return Complete;
            }
        }
    }

    // Request Management ======================================
    async CreateRequest(InputRequest: Request): Promise<Request> {
        const TempRObj:RequestManager = new RequestManager(InputRequest)
        const RequestArray:Request[] = await this.ReadRequestDate();
        const temp:number = RequestArray.push(TempRObj.DeconstructObject());
        await this.WriteRequestData(RequestArray);
        return RequestArray[temp-1];
    }

    async GetSingleRequest(InputID: string): Promise<Request> {
        const RequestArray:Request[] = await this.ReadRequestDate();
        for(let i =0; i <RequestArray.length;i++ ){
            if(RequestArray[i].id === InputID){ return RequestArray[i]}
        }
    }

    async GetAllRequest(): Promise<Request[]> {
        return  await this.ReadRequestDate();
    }

    async UpdateRequest(InputRequest: Request): Promise<Request> {
        const RequestArray:Request[] = await this.ReadRequestDate();
        for(let i =0; i <RequestArray.length;i++ ){
            if(RequestArray[i].id === InputRequest.id){ 
                RequestArray[i]=InputRequest;
                await this.WriteRequestData(RequestArray);
                return RequestArray[i]
            }
        }
    }
    
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        let RequestArray:Request[] = await this.ReadRequestDate();
        if(RequestArray.length === 0){ return true}
        for(let i =0; i <RequestArray.length;i++ ){
            if(RequestArray[i].id === InputRequest.id){ 
                RequestArray[i].RequestStatus = RequestStatus.deleted;
                RequestArray[i].ModifiedDate = Math.round(Date.now() / 1000);
                const Complete:boolean = await this.WriteRequestData(RequestArray);
                return Complete;
            }
        }
    }

}


// async function Testing(){
//     const DAO:LocalDAO = new LocalDAO();
//     console.log('DAO created')
//     const T1:Profile = {FirstName:'', LastName:'', id:"Y"};
//     const T2:Profile = {FirstName:'', LastName:'', id:"X"};
//     const XX:Profile = await DAO.CreateProfile(T1);
//     const YY:Profile = await DAO.CreateProfile(T2);
//     const TestRequest:Request = new RequestBuilder(XX.id, YY.id, 100).DeconstructRequest()
//     console.log(TestRequest)
//     setTimeout(async ()=>{
//         await DAO.CreateRequest(TestRequest)
//     }, 100);
//     setTimeout(async ()=>{
//         await DAO.DeleteRequest(TestRequest)
//     }, 1000);

// }Testing()