

import {Profile,  Request} from '../Project1-GitUtil-Reimbursement/Types/Entity';

/**Interface used to define Database Server interaction functions*/
export default interface CosmosInteractions{
    //Profile Commands=========================================
    /**Used to Initialize a Profile on the Server*/
    CreateProfile(      InputProfile:Profile):Promise<Profile>
    /**Returns a Profile from the Server*/
    GetSingleProfile(   ProfileID:string):Promise<Profile>
    /**Get All Profiles from the Server*/
    GetAllProfiles(                        ):Promise<Profile[]>
    /**Update a Profile on the Server*/
    UpdateProfile(      InputProfile:Profile):Promise<Profile>
    /**Delete a Profile on the Server permanently*/
    DeleteProfile(      InputProfile:Profile):Promise<boolean>

    //Request Commands=========================================
    /**Used to Initialize a Request on the Server*/
    CreateRequest(      InputRequest:Request):Promise<Request>
    /**Used Get a single Request from the Server*/
    GetSingleRequest(  RequestID:string):Promise<Request>
    /**Get all Request from the Server*/
    GetAllRequest(                          ):Promise<Request[]>
    /**Update a Request on the server*/
    UpdateRequest(      InputRequest:Request):Promise<Request>
    /**This does not permanently delete the request, instead it marks the request as deleted for filtering by none admins*/
    DeleteRequest(      InputRequest:Request):Promise<boolean>
}