import {Profile} from '../Types/Entity';



export default class ProfileManager{
    private MProfile:Profile;
    constructor(InitProfile:Profile){
        this.MProfile =InitProfile
    }

    public GetID():string{
        if(! this.MProfile?.id){
            const NewID:string = `${this.MProfile.FirstName}${this.MProfile.LastName}`;
            this. MProfile.id=NewID;
            return NewID;
        }
        else{ return this.MProfile.id }
    }

    public GetProfileName():string{
        return `${this.MProfile.FirstName} ${this.MProfile.LastName}`
    }

    public GetManagerID():string{
        return this.MProfile?.ManagerID ?? '';
    }

    public GetEmployeeArray():string[]{
        return this.MProfile?.EmployeeArray ?? []; 
    }

    public GetRequestArray(){
        return this.MProfile?.SendRequestIDArray ?? [] ;
    }
    public GetPassword(){
        return this.MProfile?.Password ?? "DEFAULT1SECRET1KEY";
    }

    public DeconstructProfile():Profile{
        return {
                FirstName: this.MProfile.FirstName,
                LastName:this.MProfile.LastName,
                id: this.MProfile.id ?? this.GetID(),
                Password: this.GetPassword(),
                ManagerID: this.GetManagerID(),
                EmployeeArray:this.GetEmployeeArray(),
                SendRequestIDArray: this.GetRequestArray()
                };
    }

    public AssignEmployee(employeeID:string){ 
        if(! this.MProfile?.EmployeeArray ){ this.MProfile.EmployeeArray = [employeeID]}
        else if( Number(this.GetEmployeeArray().length) <1 ){ this.MProfile.EmployeeArray = [employeeID]}
        else{ this.GetEmployeeArray().push(employeeID) }
    }

    public RemoveEmployee(employeeID:string){
        let TempArray = this.MProfile.EmployeeArray;
        for(let i =0; i < TempArray.length; i++){
            if(TempArray[i] === employeeID ){
                TempArray = TempArray.splice(i,i);
                this.MProfile.EmployeeArray = TempArray
                return;
            }
        }
    }

    public AssignManager(ManagerID:string){
        this.MProfile.ManagerID = ManagerID;

    }
    

}