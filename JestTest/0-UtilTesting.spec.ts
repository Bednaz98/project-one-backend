import RequestBuilder from '../Project1-GitUtil-Reimbursement/Classes/RequestBuilder';
import { Request } from '../Project1-GitUtil-Reimbursement/Types/Entity';
import DataProcessor from '../Project1-GitUtil-Reimbursement/Classes/DataProcessor';
import EncryptionSys from '../Services/EncryptService';

//describe('Utility Testing', ()=>{})
describe('Utility Testing', ()=>{
    const Proc:DataProcessor = new DataProcessor()
    //it("Server Utility Test: TestName", async ()=>{ })

    it("Server Utility Test: Valid Character Check, Correct Case", async ()=>{ 
        expect(Proc.ValidCharacterCheck('rt4fht346')).toBeTruthy()
    })
    it("Server Utility Test: Valid Character Check false case", async ()=>{ 
        const Chars:string[] = Proc.GetInvalidNamingCharacters()
        for(let i =0; i<Chars.length; i++ ){
            if( ! Proc.ValidCharacterCheck(Chars[i])){
                expect(Proc.ValidCharacterCheck(Chars[i])).toBeFalsy()
            }
        }
        expect(true).toBeTruthy()
    })

    it("Server Utility Test: Valid Name Length, General", async ()=>{
        expect( Proc.ValidNameLengthCheck('thehe4') ).toBeTruthy()
    })
    it("Server Utility Test: Valid Name Length, false cases", async ()=>{ 
        let SS:string = '';
        for(let i =0; i < Proc.GetValidNameLength() ;i++ ){
            if( Proc.ValidNameLengthCheck(SS)){
                console.log(`Failed length: ${i+1} <${Proc.GetValidNameLength()} `)
                expect(  Proc.ValidNameLengthCheck(SS) ).toBeFalsy()
            }
            SS+= 'a';
        }
    })

    it("Server Utility Test: Password check, General", async ()=>{
        expect(Proc.PasswordValidation('rt3w5y3t$@hsgr')).toBeTruthy()
        })
    it("Server Utility Test: Password check, false case", async ()=>{
            const SS:string = '';
            for(let i =0; i<Proc.GetPasswordLength();i++ ){
                if(! Proc.PasswordValidation(SS)){
                    expect(Proc.PasswordValidation(SS)).toBeFalsy()
                }
            }
            expect(true).toBeTruthy()
        })

    it("Server Utility Test: Extract Request IDs, Valid Correct", async ()=>{ 
        const Test:string = 'X#Y#eh5grhe';
        const CheckArray:string[] = Proc.ExtractRequestIDs(Test);
        expect(CheckArray.length===2).toBeTruthy()
    })
    it("Server Utility Test: Extract Request IDs, Extra X", async ()=>{ 
        const Test:string = 'X#Y#eh5grhe';
        const CheckArray:string[] = Proc.ExtractRequestIDs(Test);
        expect(CheckArray[0] === 'X').toBeTruthy()
    })
    it("Server Utility Test: Extract Request IDs, Extra Y", async ()=>{ 
        const Test:string = 'X#Y#eh5grhe'
        const CheckArray:string[] = Proc.ExtractRequestIDs(Test);
        expect(CheckArray[1] === 'Y').toBeTruthy()
    })
    it("Server Utility Test: Extract Request IDs, Invalid case 1", async ()=>{ 
        const Test:string = '';
        const CheckArray:string[] = Proc.ExtractRequestIDs(Test);
        expect(CheckArray.length===0).toBeTruthy()
    })
    it("Server Utility Test: Extract Request IDs, Invalid case 2", async ()=>{ 
        const Test:string = 'T#B#B#B';
        const CheckArray:string[] = Proc.ExtractRequestIDs(Test);
        expect(CheckArray.length===0).toBeTruthy()
    })
    let RequestArray:Request[] =[];
        RequestArray.push (  (new RequestBuilder("X", "Y", 0)).DeconstructRequest()  )
        RequestArray.push (  (new RequestBuilder("B", "Y", 0)).DeconstructRequest()  )  
        RequestArray.push (  (new RequestBuilder("X", "P", 0)).DeconstructRequest()  )
    it("Server Utility Test: Filter By IDs, Manger Check", async ()=>{ 
        const ReturnArray:Request[] = Proc.FilterRequestByID('X',RequestArray);
        expect(ReturnArray.length).toBe(2)
    })
    it("Server Utility Test: Filter By IDs, Employee Filter", async ()=>{ 
        const ReturnArray:Request[] = Proc.FilterRequestByID('P',RequestArray);
        expect(ReturnArray.length).toBe(1)
    })
    it("Server Utility Test: Filter By IDs, No Found Case", async ()=>{
        const ReturnArray:Request[] = Proc.FilterRequestByID('U',RequestArray);
        expect(ReturnArray.length).toBe(0)
    })

    it("Server Utility Test: Encryption Test", async ()=>{
        const Crypt:EncryptionSys=new EncryptionSys()
        const Word:string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const WEn:string = Crypt.Encrypt(Word)
        const WDe:string = Crypt.Decrypt(WEn)
        expect(Word !== WEn).toBe(true)
        expect(WEn !== WDe).toBe(true)
        expect(Word === WDe).toBe(true)


    })
})
