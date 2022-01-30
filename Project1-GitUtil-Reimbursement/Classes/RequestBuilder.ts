import { Request,  Profile} from "../Types/Entity";
import RequestManager from './RequestManager';
import { v4 } from "uuid";

export default class RequestBuilder{
    private BuildRequest:Request;
    constructor(ManagerID:string, EmployeeID:string, Amount:number){
        const TempRequestMan:RequestManager = new RequestManager({  Amount, RequestStatus:0, PostDate:  Date.now()})
        this.BuildRequest = TempRequestMan.DeconstructObject();
        this.BuildRequest.id = `${ManagerID}~${EmployeeID}~${v4()}`
    }
    public AttachInputMessage(Message:string){
        this.BuildRequest.InputMessage =Message;
    }
    public AttachManagerMessage(Message:string){
        this.BuildRequest.ManagerMessage =Message;
    }
    public DeconstructRequest():Request{
        return this.BuildRequest;
    }
}