import DAOWrapper from "../DAOClasses/DAOWrapper"
import { HTTPRequestErrorFlag } from "../Project1-GitUtil-Reimbursement/Types/Enums";
import LoggingService from "../Services/LogingService";
import ServerLogger from "../Services/ServerLogger";


describe('Service Logging', ()=>{
    const JestTimeOut:number =5000;
    const Logger:ServerLogger = new ServerLogger(0);
    const DAOClass:DAOWrapper = new DAOWrapper(0,Logger)
    const Log:LoggingService = new LoggingService (DAOClass);
    // Login Test =====================================
    it('Services-Profile: Login Error',async ()=>{
        try {
            await Log.Login('?','?')
        } catch (error) {
            expect(error.errorType).toBe( HTTPRequestErrorFlag.EmployeeNotFoundGeneral );
        }
    },JestTimeOut )

    let ProfileCon = {FirstName:'', LastName:'', Password:'', ManagerID:'', EmployeeArray:['']};
    let ReturnAuthentication:string ='';
    let userID:string ='';


    it('Logging in Successful',async ()=>{ 
        userID = (await DAOClass.CreateProfile(ProfileCon)).id
        try {
            const {ReturnProfile,  AuthenticationString }= await Log.Login(userID,"?");
            ReturnAuthentication = AuthenticationString;
            expect(AuthenticationString).toBeTruthy()
        } catch (error) {
            expect(true).toBe(false);
        }

    
    },JestTimeOut )


    it('Authentication Fails Username',()=>{ 
        try {
            const check:boolean = Log.CheckCreds('','')
            expect(false).toBe(true)
        } catch (error) {
            expect(error.errorType).toBe(HTTPRequestErrorFlag.AuthenticationNotFound)
        }
    },JestTimeOut )
    it('Authentication Fails Authentication string',()=>{ 
        try {
            Log.CheckCreds(userID,'')
            expect(false).toBe(true)
        } catch (error) {
            expect(error.errorType).toBe(HTTPRequestErrorFlag.AuthenticationStringError)
        }
    },JestTimeOut )
    it('Authentication Passes',()=>{ 
        try {
            const check:boolean = Log.CheckCreds(userID,ReturnAuthentication)
            expect(check).toBe(true)
        } catch (error) {
            expect(false).toBe(true)
        }
    },JestTimeOut )

    it('Logout Failed, username error',async ()=>{
        try {
            const check = await Log.LogOut('','')
            expect(false).toBe(true)
        } catch (error) {
            expect(error.errorType).toBe(HTTPRequestErrorFlag.AuthenticationNotFound)
        }
    },JestTimeOut )
    it('Logout failed, authentication error',async ()=>{ 
        try {
            const check  = await Log.LogOut(userID,'')
            expect(false).toBe(true)
        } catch (error) {
            expect(error.errorType).toBe(HTTPRequestErrorFlag.AuthenticationStringError)
        }
    },JestTimeOut )
    it('Logout successful',async ()=>{ 
        try {
            const check = await Log.LogOut(userID,ReturnAuthentication)
            expect(check).toBe(true)
        } catch (error) {
            expect(false).toBe(true)
        }
    },JestTimeOut )

})