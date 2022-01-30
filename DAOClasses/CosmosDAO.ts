import {CosmosClient, ItemResponse}  from "@azure/cosmos";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../Services/DateBaseStringValues";
import CosmosInteractions from './DAOInterface';
import {Profile,  Request} from '../Project1-GitUtil-Reimbursement/Types/Entity';
import ProfileManager from '../Project1-GitUtil-Reimbursement/Classes/ProfileManager';
import RequestManager from '../Project1-GitUtil-Reimbursement/Classes/RequestManager';
import ServerLogger from '../Services/ServerLogger';
import { RequestStatus } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import { response } from "express";




export default class CosmosDAOManager implements CosmosInteractions{
    private Logger:ServerLogger;
    private  CosmosClient:CosmosClient = new CosmosClient(GetPrimaryConnectionKey())
    private database = this.CosmosClient.database( GetDataBaseName() ); // Name of th DataBase
    private ProfileContainer = this.database.container( GetProfileContainerName() ); // Container name
    private RequestContainer = this.database.container( GetRequestContainerName() ); // Container name
    constructor(InitLogger:ServerLogger){
        this.Logger = InitLogger
    }

    // Profile Commands===========================================
    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        let Response
        this.Logger.print('Cosmos DAO Creating Profile')
        try {
            Response = await this.ProfileContainer.items.create<Profile>( InputProfile );
        } catch (error) {
            return undefined
        }
        const ReturnProfile:Profile= {...Response.resource}
        this.Logger.print(`Cosmos DAO Profile Created: ${ReturnProfile.FirstName}, ${ReturnProfile.LastName}`)
        return ReturnProfile;
    }
    async GetSingleProfile(ProfileID: string): Promise<Profile> {
        const ID = ProfileID;
        let Response;
        try {
            Response = await this.ProfileContainer.item(ID,ID).read<Profile>();
        } catch (error) {
            return undefined;
        }
        const ReturnProfile:Profile= {...Response.resource};
        return ReturnProfile;
    }
    async GetAllProfiles(): Promise<Profile[]> {
        try {
            const Response = await this.ProfileContainer.items.readAll<Profile>().fetchAll();
            return Response.resources;
        } catch (error) {
            return [];
        }
    }
    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        let Response
        try {
            Response = await this.ProfileContainer.items.upsert<Profile>(InputProfile);
        } catch (error) {
            return undefined
        }
        const ReturnProfile:Profile= {...Response.resource}
        return ReturnProfile;
    }
    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        const TempPObj:ProfileManager = new ProfileManager(InputProfile);
        const ID = TempPObj.GetID();
        let Response
        try {
            Response =await this.ProfileContainer.item(ID,ID).delete<Profile>();
        } catch (error) {
            return false
        }
        return true;
    }

    // Request Commands ===============================================
    async CreateRequest(InputRequest: Request): Promise<Request> {
        let Response
        try {
            Response = await this.RequestContainer.items.create<Request>( InputRequest );
        } catch (error) {
            return undefined;
        }
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }

    async GetSingleRequest(RequestID: string): Promise<Request> {
        const ID = RequestID;
        let Response;
        try {
            Response = await this.RequestContainer.item(ID,ID).read<Request>();
        } catch (error) {
            return undefined
        }
        const ReturnRequest:Request= {...Response.resource};
        return ReturnRequest;
    }
    async GetAllRequest(): Promise<Request[]> {
        try {
            const Response= await this.RequestContainer.items.readAll<Request>().fetchAll();
            return Response.resources;
        } catch (error) {
            return [];
        }
    }
    async UpdateRequest(InputRequest: Request): Promise<Request> {
        let Response;
        try {
            Response = await this.RequestContainer.items.upsert<Request>(InputRequest);
        } catch (error) {
            return undefined
        }
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        const TempRObj:RequestManager = new RequestManager(InputRequest);
        const ID = TempRObj.GetRequestID();
        let Response
        try {
            //Response = await this.RequestContainer.item(ID,ID).delete<Request>();
            InputRequest.RequestStatus = RequestStatus.deleted
            Response = await this.RequestContainer.items.upsert<Request>(InputRequest);
        } catch (error) {
            return false
        }
        return true;
    }
}



// const DAO:CosmosDAOManager= new CosmosDAOManager( new ServerLogger(0));
// async function Test(){
//     const Profile1:Profile = {FirstName:'Joshua', LastName:'Bednaz', id:'bednaz', Password:'1234', ManagerID:'',EmployeeArray:['Captain','Spiderman'] }
//     const Profile2:Profile = {FirstName:'Tony', LastName:'Star', id:'IronMan', Password:'coolGuy1', ManagerID:'',EmployeeArray:['Captain','Spiderman'] }
//     const Profile3:Profile = {FirstName:'Steve', LastName:'Rogers', id:'Captain', Password:'Merca', ManagerID:'IronMan',EmployeeArray:['Spiderman'] }
//     const Profile4:Profile = {FirstName:'Peter', LastName:'Parker', id:'Spiderman', Password:'MaryJane<3', ManagerID:'Captain',EmployeeArray:[] }
    
//     await DAO.CreateProfile(Profile1)
//     await DAO.CreateProfile(Profile2)
//     await DAO.CreateProfile(Profile3)
//     await DAO.CreateProfile(Profile4)

// }Test()