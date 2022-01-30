// import HTTPRequestHandler from "../Project1-GitUtil-Reimbursement/Classes/HTTPRequestHandler";
// import { HTTPCreateProfile, Profile } from "../Project1-GitUtil-Reimbursement/Types/Entity";
// import { HTTPCommands } from "../Project1-GitUtil-Reimbursement/Types/Enums";



// describe('Server Route Test',()=>{
//     const JestTimeOut:number =500000;
//     const HTTPRH:HTTPRequestHandler = new HTTPRequestHandler();
//     //it('Route Test: [TESTNAME]', async ()=>{},JestTimeOut)

//     if(async ()=>await HTTPRH.CheckConnection()){
//         console.log('Route Testing Active')
//     }

//         const InitialProfile:HTTPCreateProfile = {FirstName:'TestingFirst', LastName:'TestLast', Password:'PssWord', ManagerID:'', EmployeeArray:[]}
//         let ReturnBody;
//         it('Route Test: Create Account',async ()=>{
//             const  ReturnBody:Profile =  await HTTPRH.CreateProfile( {... InitialProfile});
//             expect(ReturnBody).toBeTruthy();
//         },JestTimeOut)

//         // it('Route Test: Change First Name',async ()=>{
//         //     ReturnBody =  await HTTPRH.ChangeFirstName( 'NewFirstName');
//         //     expect(ReturnBody).toBeTruthy();
//         // },JestTimeOut)
        
// })