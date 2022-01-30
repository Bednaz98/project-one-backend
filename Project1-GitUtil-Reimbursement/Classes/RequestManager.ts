import { Profile, Request } from '../Types/Entity';
import DataProcessor from './DataProcessor';
DataProcessor

export default class SingleRequest {
    private SRequest:Request;
    constructor(InitRequest:Request){
        this.SRequest = InitRequest;
    }
    DeconstructObject():Request {
        return {
            id: this.GetRequestID(),
            Amount: this.GetAmount(),
            RequestStatus: this.GetStatus(),
            PostDate: this.GetPostDate(),
            ModifiedDate: this.GetModifyDate(),
            InputMessage: this. GetInputMessage(),
            ManagerMessage: this.GetManagerMessage()
            }
    }

    public GetRequestID():string{
        return this.SRequest?.id || 'INVALID-REQUEST'
    }

    public GetManagerID():string{
        const Proc:DataProcessor = new DataProcessor()
        return Proc.ExtractRequestIDs(  this.SRequest.id)[0]
    }
    public GetEmployeeID():string{
        const Proc:DataProcessor = new DataProcessor()
        return Proc.ExtractRequestIDs(  this.SRequest.id)[1]
    }

    public GetAmount():number{
        return this.SRequest?.Amount || 0;
    }

    public GetPostDate():number{
        return this.SRequest?.PostDate || Date.now() ;
    }

    public GetModifyDate():number{
        return this.SRequest?.ModifiedDate || Date.now() ;
    }

    public SetModifyDate(NewDate:number){
        if( NewDate >   Date.now()){this.SRequest.ModifiedDate = NewDate}
        else { this.SRequest.ModifiedDate = Date.now() }
    }

    public GetInputMessage():string{
        return this.SRequest?.InputMessage ?? ''
    }
    public GetManagerMessage():string{
        return this.SRequest?.ManagerMessage ?? ''
    }

    public GetStatus(){ return this.SRequest?.RequestStatus || 0; }

    // Status Changes=====================================
    public SetStatusDenied(){ this.SRequest.RequestStatus=1; }
    public SetStatusApproved(){ this.SRequest.RequestStatus=2; }
    public SetStatusDeleted(){ this.SRequest.RequestStatus=3; }


}