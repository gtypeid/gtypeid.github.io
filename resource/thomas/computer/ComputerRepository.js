

export default class ComputerRepository{
    constructor(){
        this._cmdStore = new Map();
    }

    isMatch(cmdContext){
        let result = {
            isValid : false,
            error : "FAILED: defaultError"
        };

        const {cmd, server, port} = cmdContext;
        const hasServer = this._cmdStore.has(server);
        if(cmd === "run"){
            if(!hasServer){
                this._cmdStore.set(server, new Map() );
            }
            const matchServer = this._cmdStore.get(server);
            const hasBindPort = matchServer.has(port);
            if(!hasBindPort){
                matchServer.set(port, cmdContext);
                result.isValid = true;
                result.error = "";
            }
            else{
                result.error = "FAILED: 해당 포트 사용중"
            }
        }
        else if(cmd === "exit"){
            if(hasServer){
                const matchServer = this._cmdStore.get(server);
                const hasBindPort = matchServer.has(port);
                if(hasBindPort){
                    
                    matchServer.delete(port);
                    result.isValid = true;
                    result.error = "";
                }
                else{
                    result.error = "FAILED: 해당 포트 사용중인 서버 없음"
                }
            }
            else{
                result.error = "FAILED: 해당 서버 없음"
            }
        }
        return result;
    }
}

    /*
    

export default class CmdContext{
    constructor(){
        this.cmd;
        this.server;
        this.port;
        this.module;
        this.params;
    }
}

    */