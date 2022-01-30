import {readFile, writeFile} from 'fs/promises';

export default class Logger{
    private LogLevel:LogSetting
    constructor(Level:LogSetting){
        this.LogLevel = Level;
    }
    private LogFilePath():string{
        return './log.txt';
    }
    private async ReadDate():Promise<string> {
        const DataBuffer: Buffer  = await readFile(this.LogFilePath());
        const TempProfiles:string = DataBuffer.toString()
        return TempProfiles;
    }
    private async WriteProfileData(InputData:string){
        const thing= await writeFile(this.LogFilePath(), InputData);// (path, data to write)
        return thing;
    }
    /**Used to Log Debug Message. Messages will be Ignored if the Log Classes Level is greater than the input level. default = 1, Condensed Messaged*/
    public async print(Message:string, Level:LogSetting =1){
        // if(this.LogLevel=0){ return }
        // else if(Level>= this.LogLevel){
        //     const LogDate = new Date().toString
        //     const Input = `${LogDate}: -- ${Message}\n`;
        //     let Log:string = await this.ReadProfileDate()
        //     Log+= Input;
        //     await this.WriteProfileData(Log)
        //     console.log(Log);
        // }
        // else {return}
        const Input = `${new Date().toString()} =>  ${Message}\n`;
        let file:string = await this.ReadDate();
        file +=Input;
        const T = await this.WriteProfileData(file);
        console.log(Input);
    }

    
}

enum LogSetting{
    Verbose,
    Condensed,
    Ignore
}

// const Log:Logger = new Logger(0);
// Log.print('Other')