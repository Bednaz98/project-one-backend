import DAOWrapper from "./DAOClasses/DAOWrapper";
import ProfileManager from "./Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import { Profile } from "./Project1-GitUtil-Reimbursement/Types/Entity";
import Logger from "./Services/ServerLogger";



export default class FData{
    private TLogger = new Logger (0)
    private TestDAO:DAOWrapper = new DAOWrapper(0, this.TLogger  );
    ProfileArray:ProfileManager[] = [];
    public async GenerateCompany(){
        const FirstNameArray:string[] = ['Tony','Incredible','Spider','Captain']
        const LastNameArray:string[] = ['Stark','Hulk','Man','America']
        for(let i =0; i< FirstNameArray.length; i++){
            this.ProfileArray.push (  (new ProfileManager( {FirstName:FirstNameArray[i], LastName:LastNameArray[i]} ) )   )
        }
        // Set Up: Tony Stark
        this.ProfileArray[0].AssignEmployee(this.ProfileArray[1].GetID())
        this.ProfileArray[0].AssignEmployee(this.ProfileArray[2].GetID())
        this.ProfileArray[0].AssignEmployee(this.ProfileArray[3].GetID())
        //Set Up: Captain America 
        this.ProfileArray[3].AssignManager(this.ProfileArray[0].GetID())
        this.ProfileArray[3].AssignEmployee(this.ProfileArray[1].GetID())
        this.ProfileArray[3].AssignEmployee(this.ProfileArray[2].GetID())
        // Set Up: Incredible Hulk
        this.ProfileArray[1].AssignManager(this.ProfileArray[3].GetID())
        this.ProfileArray[1].AssignEmployee(this.ProfileArray[2].GetID())
        //Set Up: Spider Man
        this.ProfileArray[2].AssignManager(this.ProfileArray[2].GetID())

        for(let i=0; i < this.ProfileArray.length; i++ ){
            await this.TestDAO.CreateProfile(   this.ProfileArray[i].DeconstructProfile() )
        }
    }

    async clearCompany(){
        for(let i =0; i < this.ProfileArray.length; i++ ){
            this.TestDAO.DeleteProfile( this.ProfileArray[i].DeconstructProfile() )
        }
    }
}


const T:FData = new FData() 

T.GenerateCompany()
