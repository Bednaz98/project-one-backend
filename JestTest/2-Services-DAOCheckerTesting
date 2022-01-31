import DAOWrapper from "../DAOClasses/DAOWrapper";
import DataProcessor from "../Project1-GitUtil-Reimbursement/Classes/DataProcessor";
import ProfileManager from "../Project1-GitUtil-Reimbursement/Classes/ProfileManager";
import { Profile } from "../Project1-GitUtil-Reimbursement/Types/Entity";
import DAOCheckManager from "../Services/DAOCheckService";
import ServerLogger from "../Services/ServerLogger";


describe('DAOCheckManager', ()=>{
    const JestTimeOut:number =5000;
    const Logger:ServerLogger = new ServerLogger(0);
    const DAO:DAOWrapper = new DAOWrapper(0,Logger);
    const InitProc: DataProcessor= new DataProcessor();
    const Checker:DAOCheckManager = new DAOCheckManager(DAO,Logger,InitProc);
    const TestEmployee:ProfileManager = new ProfileManager({FirstName:'', LastName:""});
    //it("Services-DAOCheck: TestName", async ()=>{ }, JestTimeOut)

    it("Services-DAOCheck: Check employee exist", async ()=>{
        await DAO.CreateProfile( TestEmployee.DeconstructProfile() );
        const Result:boolean= await Checker.EmployeeExist(TestEmployee.GetID());
        expect(Result).toBe(true)
    }, JestTimeOut)
    it("Services-DAOCheck: check employee does not exist", async ()=>{ 
        const Result:boolean= await Checker.EmployeeExist( '?' );
        expect(Result).toBe(false)
    }, JestTimeOut)

    it("Services-DAOCheck: check is not admin", async ()=>{ 
        const result:boolean = await  Checker.IsAdmin( (TestEmployee.DeconstructProfile()) )
        expect(result).toBe(false)
    }, JestTimeOut)

    it("Services-DAOCheck: check not IsManager", async ()=>{ 
        const result:boolean = await  Checker.IsManger( (TestEmployee.DeconstructProfile()) )
        expect(result).toBe(false)
    }, JestTimeOut)
    it("Services-DAOCheck: check is admin", async ()=>{ 
        TestEmployee.AssignEmployee('TestID1');
        const result:boolean = await  Checker.IsAdmin( (TestEmployee.DeconstructProfile()) )
        expect(result).toBe(true)
    }, JestTimeOut)
    it("Services-DAOCheck: check IsManager", async ()=>{ 
        TestEmployee.AssignManager('TestID2');
        const result:boolean = await  Checker.IsManger( (TestEmployee.DeconstructProfile()) )
        expect(result).toBe(true)
    }, JestTimeOut)

    it("Services-DAOCheck: check manager not exist", async ()=>{
        const result:boolean = await  Checker.IsManger( {FirstName:'6', LastName:'5', id:"?"} )
        expect(result).toBe(false)
    }, JestTimeOut)
    it("Services-DAOCheck: check admin not exist", async ()=>{ 
        const result:boolean = await  Checker.IsAdmin( {FirstName:'6', LastName:'5', id:"?"} )
        expect(result).toBe(false)
    }, JestTimeOut)
    afterAll( async () => {  await DAO.DeleteProfile( TestEmployee.DeconstructProfile() )   });
    // Delete testing file
    //setTimeout( async ()=> await DAO.DeleteProfile( TestEmployee.DeconstructProfile() ) , 100000)

})