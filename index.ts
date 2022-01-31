import cors from "cors";
import express from "express";
import { parseJsonText } from "typescript";
import DAOWrapper from "./DAOClasses/DAOWrapper";
import DataProcessor from "./Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import { Profile, Request } from "./Project1-GitUtil-Reimbursement/Types/Entity";
import { HTTPRequestErrorFlag, RequestStatus } from "./Project1-GitUtil-Reimbursement/Types/Enums";
import AdminService from "./Services/AdminService";
import DAOCheckManager from "./Services/DAOCheckService";
import EncryptionSys from "./Services/EncryptService";
import LoginService from "./Services/LogingService";
import ProfileService from "./Services/ProfileService";
import RequestService from "./Services/RequestService";
import Logger from "./Services/ServerLogger";
import {ResultReturnMarkRequest, ResultReturnStringID, TransferRequest, TransferRequestArray,ResultReturnCheck, TransferProfile} from './Project1-GitUtil-Reimbursement/Types/dto';


// Class Initializes=========================
// Server Init
const app = express(); // Server Init


//Server Options================================
// Converts body to json Automatically
app.use(express.json()); // Auto convert all incoming request to json
app.use(cors()); // enable cors

let portNumber:number | string;
portNumber = process.env.PORT ?? 3001

//==============================================
// Logging service
const DebugLog:Logger = new Logger (2)
//Services ======================
// DAO
const DAOClass:DAOWrapper  = new DAOWrapper (2,DebugLog);


app.listen(portNumber,  ()=> {
    console.log(`${coolServerIntro()} \n Starting on >>>>>  localhost:${portNumber} `); 
    DebugLog.print(coolServerIntro());
});
// low level level services
const Proc:DataProcessor = new DataProcessor();
const DAOCheck:DAOCheckManager = new DAOCheckManager(DAOClass,DebugLog,Proc);
const Encrypt:EncryptionSys = new EncryptionSys();

// higher level services
const PS:ProfileService = new ProfileService(DAOClass,Proc,DAOCheck,DebugLog );
const RS:RequestService = new RequestService(DAOClass, Proc, DAOCheck,DebugLog);
const AS:AdminService = new AdminService(DAOClass, DAOCheck);
const LS:LoginService = new LoginService(DAOClass)

app.get('/Connect', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    res.status(200)
    await DebugLog.print('Connection Hit',0)
    res.send(JSON.stringify('Connected'));
})

app.post('/Login/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {password, AuthenticationString} = req.body
    await  DebugLog.print(`Login requested [${ID}]`,0)
    const LoginReturn = await LS.Login(ID,password)
    if(LoginReturn.ReturnProfile){
        res.status(201)
    }
    else{res.status(401)}
    await DebugLog.print(`Login success  [${JSON.stringify( LoginReturn )}]`,0)
    res.send(JSON.stringify( LoginReturn ));
})

app.patch('/LogOut/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    await  DebugLog.print(`Logout requested: [${ID}]`,0)
    const {authentication}=req.body;
    const ReturnResult = await LS.LogOut(ID,authentication)
    await  DebugLog.print(`Logout result: [${ JSON.stringify(ReturnResult) }]`,0)
    res.status(200)
    res.send(JSON.stringify(ReturnResult));
})



// PROFILE ROUTES ######################################################
// CreateProfile(ProfileInit:HTTPCreateProfile):Promise<Profile>
app.post('/Create', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    await  DebugLog.print('HTTP Create Profile',0)
    const {FirstName,LastName, Password, id}=req.body;
    try {
        await DebugLog.print('Create Try block',0)
        //create
        const ReturnLogin = await PS.CreateProfile( {FirstName,LastName, Password, id});
        const ReturnAuthentication = await LS.CreateCreds(ReturnLogin .ReturnProfile.id);
        ReturnLogin.AuthenticationString = ReturnAuthentication
        await DebugLog.print(`Return Profile: [${JSON.stringify( ReturnLogin  )}]`,0)
        res.status(202);
        res.send(JSON.stringify( ReturnLogin ));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// ChangeFirstName(EmployeeID:string, NewFirstName:string):Promise<string>
app.patch('/Profile/:ID/ChangeFirst', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authentication, NewFirstName } = req.body;
    await  DebugLog.print(`First name change requested [${ID}] => [${NewFirstName}]`,0)
    try {
        const ResultReturnString =await PS.ChangeFirstName(ID,NewFirstName)
        await DebugLog.print(`Return First Name: [${JSON.stringify( ResultReturnString ) }]`,0)
        res.status(202)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// ChangeLastName(EmployeeID:string, NewLastName:string):Promise<string>
app.patch('/Profile/:ID/ChangeLast', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authentication, NewLastName }=req.body;
    await  DebugLog.print(`Last name change requested: [${ID}] => [${NewLastName}]`,0)
    try {
        const ResultReturnString = await PS.ChangeLastName(ID,NewLastName )
        res.status(202)
        await DebugLog.print(`Last name return: [JSON.stringify( ResultReturnString )]`,0)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// ChangePassword(EmployeeID:string, NewPassword:string):Promise<string>
app.patch('/Profile/:ID/ChangePassword', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {authenticationString, NewPassword }=req.body;
    await  DebugLog.print(`Password change requested [${ID}] => [${ NewPassword}]`,0)
    try {
        const ResultReturnString = await PS.ChangePassword(ID,NewPassword  )
        res.status(202)
        res.send(JSON.stringify({...ResultReturnString}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// GetManagerName(ManagerID:string):Promise<string> ###################################################
app.get('/Profile/:ID/Manager/:IDManager', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID,IDManager} = req.params;
    await  DebugLog.print(`Manager name Requested [${ID}] => [${ IDManager}]`,0)
    try {
        const ResultReturnString = await PS.GetManagerName(IDManager)
        res.status(200)
        await  DebugLog.print(`Manager Name Sent: [${ResultReturnString.ReturnString}]`,0)
        res.send(JSON.stringify( ResultReturnString ));
    } catch (error) {
        res.status(204)
        res.send(JSON.stringify('not assigned a manager'));
    }
})
// MakeRequest(EmployeeID:string, Amount:number, file:any):Promise<Request>
app.post('/Request/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const {AuthenticationString, Amount,  Message }=req.body;
    await  DebugLog.print(`Request Request creation [${ID}] => [${Amount}]`,0)
    try {
        const ReturnRequestArray = await PS.MakeRequest(ID,Amount, Message)
        res.status(201)
        await  DebugLog.print(`Created Request Sent [${ID}] => [${ReturnRequestArray.ReturnRequest.id}]`,0)
        await  DebugLog.print(`Created Incoming Message:  [ ${Message} ]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// DeleteRequest(EmployeeID:string, RequestID:string):Promise<boolean>
app.delete('/Request/:ID/:AuthorizationString/:RequestID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID, AuthorizationString,RequestID} = req.params;
    await  DebugLog.print(`Requested Delete Request [${ID}] => [${RequestID}]`,0)
    try {
        const ReturnResult= await PS.DeleteRequest(ID, RequestID)
        res.status(200)
        await  DebugLog.print(`Delete Request return string [${ID}] => [${ReturnResult.ResultCheck}]`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// GetAllSentRequestOfType(IDstring:string, Type:RequestStatus):Promise<Request[]>
app.get('/Request/:ID/:AuthorizationString/:Type', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID, AuthorizationString} = req.params;
    const Type:number = parseInt(req.params.Type);
    await  DebugLog.print(`HTTP Request search[${ID}] => type (number): [${Type}]`,0)
    try {
        const ReturnRequestArray:TransferRequestArray = await PS.GetAllSentRequestOfType(ID,Type );
        res.status(200);
        await  DebugLog.print(`Request search [${ID}] => sent ${ReturnRequestArray.ReturnRequestArray.length}`,0)
        res.send(JSON.stringify(ReturnRequestArray));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})

//Manager Routes #######################################################
//ManagerChangeRequest(ManagerID:string, RequestID:string,Type:RequestStatus ):Promise<Request>
app.patch('/Manager/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {ID} = req.params;
    const BodyReturn:ResultReturnMarkRequest = req.body
    await  DebugLog.print(`HTTP Manager change Request [${ID}] => Type:[${RequestStatus[BodyReturn.Type]}] >> [${BodyReturn.ReturnString}]`,0);
    try {
        await  DebugLog.print(`Manager change > [${BodyReturn.Type}]`,0);
        const ReturnRequestArray:TransferRequest =  await RS.ManagerChangeRequest(ID,BodyReturn.ReturnString,BodyReturn.Type, BodyReturn.Message)
        res.status(200)
        await  DebugLog.print(`Manager request change sent [${ID}] => type:[${RequestStatus[ReturnRequestArray.ReturnRequest.RequestStatus]}] >> [${ReturnRequestArray.ReturnRequest.id}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// manager request search
app.get('/Manager/:ID/:Type/:AuthorizationString', async (req,res)=>{
    console.log("HELOOOOOOO")
    await  DebugLog.print('===============================================',0)
    const {ID,AuthorizationString} = req.params;
    const Type:RequestStatus= parseInt(req.params.Type)
    await  DebugLog.print(`HTTP Manager getting all request [${ID}] `,0)
    try {
        const ReturnRequestArray = await RS.ManagerGetAllRequest(ID,Type)
        res.status(200)
        await  DebugLog.print(`Manager search sent [${ID}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})

app.get('/Records', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    try {
        await  DebugLog.print(`HTTP Records requested `,0)
        const ReturnRequestArray = await RS.ManagerGetRecords()
        res.status(200)
        await  DebugLog.print(`Record length return: [${ReturnRequestArray.ReturnRecords.length}]`,0)
        res.send(JSON.stringify({...ReturnRequestArray}));
    } catch (error) {
        SendErrorResponse(error,res )
    }

})

app.get('/CheckManagerPermission/:ID',async(req,res)=>{
    await  DebugLog.print('===============================================',0)
    await  DebugLog.print('HTTP permission check',0)
    const {ID} = req.params;
    let ResultReturnCheck:ResultReturnCheck = {ResultCheck: false }
    try {
        await  DebugLog.print(`Checking manager permissions: [${ID}]`,0);
        ResultReturnCheck = await RS.CheckManagerPermissions(ID)
        res.status(200)
        await  DebugLog.print(`Permission Status returned: [${ResultReturnCheck.ResultCheck}]`,0)
        res.send(JSON.stringify({...ResultReturnCheck}));
    } catch (error) {
        res.status(204)
        res.send(JSON.stringify({...ResultReturnCheck}));

    }
})

app.get('/CheckAdminPermission/:ID',async(req,res)=>{
    await  DebugLog.print('===============================================',0)
    await  DebugLog.print('HTTP permission check',0)
    const {ID} = req.params;
    let ResultReturnCheck:ResultReturnCheck = {ResultCheck: false }
    try {
        await  DebugLog.print(`Checking admin permissions: [${ID}]`,0);
        ResultReturnCheck = await RS.CheckAdminPermissions(ID)
        res.status(200)
        await  DebugLog.print(`Permission Status returned: [${ResultReturnCheck.ResultCheck}]`,0)
        res.send(JSON.stringify({...ResultReturnCheck}));
    } catch (error) {
        res.status(204)
        res.send(JSON.stringify({...ResultReturnCheck}));

    }
})



// Admin Routes ########################################################

app.post('/AdminCreate', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    const {authentication,ProfileInit, ManagerID }=req.body;
    try {
        await  DebugLog.print(`HTTP Admin create profile: \n --[${ProfileInit}] >>>  ManagerID [${ManagerID}] `,0)
        const ReturnProfile:TransferProfile = await AS.AdminCreateProfile(ProfileInit, ManagerID)
        res.status(202)
        await  DebugLog.print(`Return Profile create: [${ReturnProfile }]`,0)
        res.send(JSON.stringify({...ReturnProfile }));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})

// AdminGetAllEmployees():Promise<Profile[]>
app.get('/Admin/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication }=req.body;
    await  DebugLog.print(`Admin Request All employees ${ID}`,0)
    try {
        const ReturnProfileArray = await AS.AdminGetAllEmployees()
        res.status(200)
        await  DebugLog.print(`Admin profile search sent [${ID}]]`,0)
        res.send(JSON.stringify({...ReturnProfileArray}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// AdminAssignManager(EmployeeID:string, ManagerID:string):Promise<boolean>
app.patch('/Admin/:ID/Assign', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID, ManagerID }=req.body;
    await  DebugLog.print(`Admin Request assignments ${ID} => ${EmployeeID} >> ${ManagerID}`,0)
    try {
        const ReturnResult = await AS.AdminAssignManager(EmployeeID, ManagerID)
        res.status(202)
        await  DebugLog.print(`Admin Assignment return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
// AdminRemoveEmployeeAssignment(EmployeeID:string, ManagerID:string, AdminID:string):Promise<boolean>
app.patch('/Admin/:ID/UnAssign', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID, ManagerID }=req.body;
    await  DebugLog.print(`Admin Request Un-assignment ${ID} => ${EmployeeID} >> ${ManagerID}`,0)
    try {
        const ReturnResult = await AS.AdminRemoveEmployeeAssignment(EmployeeID, ManagerID, ID)
        res.status(202)
        await  DebugLog.print(`Admin un-assignment return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})
//AdminDeleteProfile(EmployeeID: string): Promise<boolean>
app.delete('/Admin/:ID', async (req,res)=>{
    await  DebugLog.print('===============================================',0)
    let ID:string = req.params.ID;
    ID = ID.replace(':','')
    const {authentication, EmployeeID }=req.body;
    await  DebugLog.print(`Admin request delete profile ${ID} => ${EmployeeID}`,0)
    try {
        const ReturnResult = await AS.AdminDeleteProfile(EmployeeID)
        res.status(200)
        await  DebugLog.print(`Admin delete profile return sent`,0)
        res.send(JSON.stringify({...ReturnResult}));
    } catch (error) {
        SendErrorResponse(error,res )
    }
})


function SendErrorResponse(error,res ){
    switch(error?.errorType){
        //invalid content error
        case HTTPRequestErrorFlag.NameToShort:{ res.status(406); break }
        case HTTPRequestErrorFlag.NameCharError:{ res.status(406); break }
        case HTTPRequestErrorFlag.PasswordInitError:{ res.status(406); break }
        case HTTPRequestErrorFlag.InitManagerNotExist:{ res.status(406); break }
        case HTTPRequestErrorFlag.InitEmployeeError:{ res.status(406); break }
        // server state conflict
        case HTTPRequestErrorFlag.ProfileAlreadyExist:{ res.status(409); break }
        //Not found errors
        case HTTPRequestErrorFlag.ManagerNameNotFound:{ res.status(404); break }
        case HTTPRequestErrorFlag.EmployeeNotFoundGeneral:{ res.status(404); break }
        case HTTPRequestErrorFlag.RequestCreationError:{ res.status(404); break }
        case HTTPRequestErrorFlag.RequestNotFound:{ res.status(404); break }
        case HTTPRequestErrorFlag.EmployeeAssignmentError:{ res.status(404); break }
        //Update Errors
        case HTTPRequestErrorFlag.ProfileUpdateError:{ res.status(500); break }
        case HTTPRequestErrorFlag.RequestUpdateError:{ res.status(500); break }
        //access errors
        case HTTPRequestErrorFlag.RequestManagerDeleteError:{ res.status(400); break }
        case HTTPRequestErrorFlag.RequestManagerInvalidType:{ res.status(400); break }
        //un-authorized  errors
        case HTTPRequestErrorFlag.EmployeeRequestAccessError:{ res.status(403); break }
        case HTTPRequestErrorFlag.RequestFilterDenied:{ res.status(403); break }
        case HTTPRequestErrorFlag.RequestChangeStatusError:{ res.status(403); break }
        case HTTPRequestErrorFlag.ManagerNotValidPrivileges:{ res.status(403); break }
        // pure server error
        case HTTPRequestErrorFlag.RequestDeletionError:{ res.status(500); break }
        case HTTPRequestErrorFlag.ProfileServerCreationError:{ res.status(500); break }
        case HTTPRequestErrorFlag.UnAssignError:{ res.status(500); break }
        // login errors
        case HTTPRequestErrorFlag.AuthenticationNotFound:{ res.status(511); break }
        case HTTPRequestErrorFlag.AuthenticationStringError:{ res.status(401); break }
        // default 
        default: { res.status(500); break }
    }
    res.send( JSON.stringify( error ) );
    return;
}


function coolServerIntro(){
    return(`\n
######################################
##  Reimbursement Backend 0.0.1a    ##
##  New Server Sessions Started     ##
######################################`
)}