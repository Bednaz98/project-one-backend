import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../Services/DateBaseStringValues";
import { Profile, Request } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import RequestBuilder from "../Project1-GitUtil-Reimbursement/Classes/RequestBuilder";
import DAOWrapper from "../DAOClasses/DAOWrapper";
import { Container } from "@azure/cosmos";
import ServerLogger from "../Services/ServerLogger";



//it("DAO: TestName", async ()=>{ }, JestTimeOut)

describe('DAO Test', ()=>{
    const JestTimeOut:number =5000;
    // this is where you check the DAO setting, make sure everything is setup to the DAO you want to use
    // ###########################################################################
    const Logger:ServerLogger = new ServerLogger(0);
    const DAO:DAOWrapper = new DAOWrapper(0, Logger);
    it('DAO: Check to see if correct DAO is being used', ()=>{
        expect(DAO.WhichDao()).toBe(0);
    })
    //##############################################################################

    // check if DAO keys and Database names are set
    it("DAO: Primary Key", async ()=>{
        expect(GetPrimaryConnectionKey()).toBeTruthy()
    }, JestTimeOut)
    it("DAO: Database name", async ()=>{
        expect(GetDataBaseName()).toBeTruthy()
    }, JestTimeOut)
    it("DAO: profile container name", async ()=>{
        expect(GetProfileContainerName()).toBeTruthy()
    })
    it("DAO: request container name", async ()=>{
        expect(GetRequestContainerName()).toBeTruthy()
    },JestTimeOut)

    const FirstNameArray:string[] = ['Admin','Manager','Employee']
    const LastNameArray:string[] = ['LastAd','ManLast','EmpLast']

    // Profile checks==================================
    it("DAO: Creating Profiles", async ()=>{
        let Check:boolean = true;
        for(let i = 0; i<FirstNameArray.length; i++ ){
            if(!Check) continue;
            let Temp:Profile = await DAO.CreateProfile( {...(new ProfileManager({FirstName:FirstNameArray[i],LastName:LastNameArray[i]})).DeconstructProfile(), id:"testing"} )
            Check = (Temp !== undefined);
        }
        expect(Check).toBeTruthy();
    },JestTimeOut)

    let ProfileArray:Profile[] = [];
    it("DAO: Check get all Profile", async ()=>{
        ProfileArray = await DAO.GetAllProfiles();
        expect(ProfileArray.length >0).toBeTruthy;
    }, JestTimeOut)

    it("DAO: Creating duplicate Profiles", async ()=>{
        let Check:boolean = true;
        for(let i = 0; i<FirstNameArray.length; i++ ){
            if(!Check) continue;
            let Temp:Profile = await DAO.CreateProfile( (new ProfileManager({FirstName:FirstNameArray[i],LastName:LastNameArray[i]})).DeconstructProfile() )
            Check = (Temp !== undefined)
        }
        expect(Check).toBe(false);
    }, JestTimeOut)

    it("DAO: Check Get Single Profile", async ()=>{
        const ReturnProfile = await DAO.GetSingleProfile(ProfileArray[0].id)
        expect(ReturnProfile.id).toBe(ProfileArray[0].id);
    }, JestTimeOut)
    it("DAO: Check failed to find profile", async ()=>{
        const ReturnProfile = await DAO.GetSingleProfile('?')
        expect(ReturnProfile == undefined).toBe(true);
    }, JestTimeOut)

    it("DAO: Update Profile",async ()=>{}, JestTimeOut)
    it("DAO: failed Update Profile",async ()=>{}, JestTimeOut)

    //Request Checks ========================================
    let RequestArray:Request[] =[];
    let RequestIDArray:string[] =[];
    it("DAO: Check create Request", async ()=>{
        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[1].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[1].id, ProfileArray[2].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[2].id, 0)).DeconstructRequest()  )
        let Check:boolean = true;
        for(let i =0; i <RequestArray.length;i++ ){
            if(!Check) {continue}
            let Temp:Request = await DAO.CreateRequest(RequestArray[i])
            Check = (Temp !== undefined)
            RequestIDArray.push(Temp.id)
        }
        expect(Check).toBeTruthy();
    }, JestTimeOut)

    it("DAO: Check get All Request", async ()=>{
        const ReturnRequest:Request[] = await DAO.GetAllRequest();
        expect(ReturnRequest.length).toBe(RequestArray.length);
    }, JestTimeOut)

    it("DAO: Check create duplicate Request", async ()=>{
        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[1].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[1].id, ProfileArray[2].id, 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder(ProfileArray[0].id, ProfileArray[2].id, 0)).DeconstructRequest()  )
        let Check:boolean = true;
        for(let i =0; i <RequestArray.length;i++ ){
            RequestArray[i].id = RequestIDArray[i]
            let Temp:Request = await DAO.CreateRequest(RequestArray[i])
            Check = (Temp !== undefined)
        }
        expect(Check).toBe(false);
    }, JestTimeOut)

    it("DAO: Check get request",async ()=>{
        const ReturnRequest = await DAO.GetSingleRequest(RequestArray[0].id)
        expect(ReturnRequest.id).toBe(RequestArray[0].id);
    }, JestTimeOut)

    it("DAO: Check failed to find request",async ()=>{
        const ReturnRequest = await DAO.GetSingleRequest('?')
        expect(ReturnRequest == undefined).toBe(true);
    }, JestTimeOut)

    it("DAO: Update Request",async ()=>{}, JestTimeOut)
    it("DAO: failed Update Request",async ()=>{}, JestTimeOut)

    // Delete dynamic entries and clean up DAO
    it("DAO: Check Delete Request", async ()=>{ 
        let check:boolean = true;
        for(let i =(await DAO.GetAllRequest()).length-1; i>-1  ;i-- ){
            if(!check){ console.log("error skipping"); continue  }
            check = await DAO.DeleteRequest(RequestArray[i]);
        }
        expect(check).toBe(true);
    }, JestTimeOut)
    it("DAO: Check Delete All Requests", async ()=>{
        expect(  (await DAO.GetAllRequest()).length ).toBe(0)
        // switch(DAO.WhichDao()){
        //     case 0:{ expect(  (await DAO.GetAllRequest()).length ).toBe(0) }
        //     case 1:{ expect(  (await DAO.GetAllRequest()).length  ).toBe(0) }
        //     case 2:{ expect(true).toBe(true)}
        //     default: { expect(false).toBe(true)}
        // }
    }, JestTimeOut)

    it("DAO: Check Delete Profiles", async ()=>{
        let check:boolean = true;
        for(let i =ProfileArray.length-1; i >-1; i--){
            if(!check){ console.log("error skipping"); continue } 
            check = await DAO.DeleteProfile(ProfileArray[i]);
        }
        expect(check).toBeTruthy();
    }, JestTimeOut)
    it("DAO: Check Delete All Profiles", async ()=>{
        expect(  (await DAO.GetAllProfiles()).length  ).toBe(0) 
        // switch(DAO.WhichDao()){
        //     case 0:{ expect(  (await DAO.GetAllProfiles()).length  ).toBe(0) }
        //     case 1:{ expect(  (await DAO.GetAllProfiles()).length  ).toBe(0) }
        //     case 2:{ expect(true).toBe(true)}
        //     default: { expect(false).toBe(true)}
        // }
    }, JestTimeOut)
})

