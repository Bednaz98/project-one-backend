import {Request} from '../Types/Entity';


export default class DataProcessor{
    /**Return an array of invalid characters*/
    GetInvalidNamingCharacters():string[]{
        return ['#', '$', ' ', '-', '=', '+', '_', '%', '@', '!','~'];
    }

    /**Checks the input name to see if it is free of invalid characters*/
    ValidCharacterCheck(InputName:string):boolean{
        const CheckArray:string[] = this.GetInvalidNamingCharacters()
        for(let i =0; i <CheckArray.length; i++){
            if(InputName.includes(CheckArray[i])){return false}
        }        
        return true;
    }
    /**Return the minium length for a name*/
    GetValidNameLength():number{
        return 3;
    }
    /**checks to see if a name has the proper length*/
    ValidNameLengthCheck(InputName:string):boolean{
        return (InputName.length>= this.GetValidNameLength())
    }
    /*Searches the input string to attempt to find the [Manager - Employee] IDs in this order. Returns an empty error if invalid or not found*/
    ExtractRequestIDs(InputID:string):string[]{
        const ReturnArray:string[] = InputID.split('~');
        if(ReturnArray.length !== 3) { return [] }
        return [ReturnArray[0], ReturnArray[1]];
    }

    /**Return an array if for request that are connected to the given ID. This works for both employees and managers*/
    FilterRequestByID( ID:string,RequestArray:Request[]):Request[]{
        const TempIDArray:Request[] =[];
        for(let i = 0; i < RequestArray.length; i++){
            const TempDestructID = this.ExtractRequestIDs(RequestArray[i].id)
            if(TempDestructID.length !==2) {continue}
            else if(TempDestructID.includes(ID)) { TempIDArray.push( RequestArray[i])}
        }
        return TempIDArray;
    }

    GetPasswordLength(){
        return 3;
    }

    PasswordValidation(InputPassWord:string):boolean{
        return InputPassWord.length> this.GetPasswordLength();
    }
}

//const T:DataProcessor = new DataProcessor();

//console.log(  T.ValidCharacterCheck("ghesee")  )