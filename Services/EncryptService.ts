
// let ascii = 'a'.charCodeAt(0); // 97
// let char = String.fromCharCode(ascii); // 'a'
export default class EncryptionSys{
    private shift:number =6;
    private GetDelta(Type:CharterType):number {
        switch(Type){
            case CharterType.Uppercase:{return 25}
            case CharterType.Lowercase:{return 25}
            case CharterType.Number:{return 9}
        }
    }
    private GetSPos(Type:CharterType):number{
        switch(Type){
            case CharterType.Uppercase:{return 65}
            case CharterType.Lowercase:{return 97}
            case CharterType.Number:{return 48}
        }
    }
    // private GetLPos(Type:CharterType):number{
    //     switch(Type){
    //         case CharterType.Uppercase:{return 90}
    //         case CharterType.Lowercase:{return 122}
    //         case CharterType.Number:{return 57}
    //     }
    // }
    private CryptSwitch(Char:string, switchType:boolean):string{
        //check which conversion type
        let Type:CharterType = CharterType.Number;
        if(Char === '0'){ Type = CharterType.Number}
        else if( !Number(Char) && (Char === Char.toUpperCase())){ Type = CharterType.Uppercase}
        else if (!Number(Char) && (Char === Char.toLowerCase())){ Type = CharterType.Lowercase}
        else { Type = CharterType.Number}
        //convert 'character' to a number
        //decode on true
        switch(switchType){
            // Decrypt =============================================================
            case true:{
                switch(Type){
                    // Number =======================================================
                    case CharterType.Number:{
                        const Meta:number = ( parseInt(Char) + 2*this.shift+2) % ( 10 )  ;
                        return  String(Meta);
                    }
                    // Characters ===================================================
                    case CharterType.Lowercase:{
                        const temp:number = Char.charCodeAt(0);
                        const Meta:number = ( temp + this.shift + this.GetSPos(Type) +2) % (this.GetDelta(Type)+1) +this.GetSPos(Type);
                        return  String.fromCharCode(Meta);
                    }
                    // Characters ===================================================
                    default /*Upper Case*/:{
                        const temp:number = Char.charCodeAt(0);
                        const Meta:number = ( temp - this.shift + this.GetSPos(Type) ) % (this.GetDelta(Type)+1) +this.GetSPos(Type);
                        return  String.fromCharCode(Meta);
                    }
                }
            }
            // Encrypt=====================================================
            case false:{
                switch(Type){
                    // Number =================================================
                    case 2:{
                        const Meta:number = (parseInt(Char)+ this.shift ) % ( 10)  ;
                        return  String(Meta);
                    }
                    // Character ====================================================
                    default:{
                        const temp:number = Char.charCodeAt(0);
                        const Meta:number = ( (temp - this.GetSPos(Type)) + this.shift) % (this.GetDelta(Type) + 1) + this.GetSPos(Type);
                        return  String.fromCharCode(Meta);
                    }
                }
            }
        }
    }

    Encrypt(InputString:String):string{
        if( !(InputString.length > 0) ){return ''}
        let encrypt:string = '';
        for(let i =0; i <InputString.length; i++ ){
            encrypt += this.CryptSwitch(InputString.charAt(i) , false);
        }
        return encrypt;
    }
    Decrypt(InputString:String):string{
        if( !(InputString.length > 0) ){return ''}
        let de_encrypt:string = '';
        for(let i =0; i <InputString.length; i++ ){
            de_encrypt += this.CryptSwitch(InputString.charAt(i) , true);
        }
        return de_encrypt
    }
}

enum CharterType{
    Uppercase,
    Lowercase,
    Number
}


const Crypt:EncryptionSys = new EncryptionSys();
// const Char:string = 'z';
// console.log(Char);
// const En:string = Crypt.CryptSwitch(Char, false);
// console.log(En);
// const De:string = Crypt.CryptSwitch( En, true);
// console.log(De);
//const Word:string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//const Word:string = '0';
// console.log(Word)
// const WEn:string = Crypt.Encrypt(Word)
// console.log(WEn)
// const WDe:string = Crypt.Decrypt(WEn)
// console.log(WDe)