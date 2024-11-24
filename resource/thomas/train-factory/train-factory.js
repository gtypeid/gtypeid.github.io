
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";
import WindowPanel from "../../../js/comp/WindowPanel.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import CmdContext from "../../../js/data/thomas/CmdContext.js";
import * as Util from "../../../js/doc/Util.js";

export default class TrainFactory extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._windowPanel;
        this._eventHandler;
        this._generator;
    }

    rConstructor(){
        super.rConstructor();

        this._windowPanel = this.addComp(WindowPanel);
        this._eventHandler = this.addComp(DocEventHandler);
        this._generator = this.addComp(EntityGenerator);
        const wp = this._windowPanel;
        const eh = this._eventHandler;
        const ge = this._generator;

        wp.bindWindowPanel(eh);         
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "send-button", this);
        ge.makeElements("train-container", "train-item", this.getTrains() );

    }


    getTrains(){
        let trains = [];
        trains.push({
            icon : "train-api-sync.png",
            code : "api-sync",
            title : "서버 토마스",
            contents : "일반적인 API 서버",

            server : "api-server",
            params : [ {"--spring.profiles.active=" : "sync"} ],
            portStart : 8083,
            portEnd : 8089
        }); 

        trains.push({
            icon : "train-db-sync.png",
            code : "db-sync",
            title : "DB 토마스",
            contents : "데이터를 저장한다",

            server : "database-server",
            params : [ {"--spring.profiles.active=" : "sync"}, ],
            portStart : 8093,
            portEnd : 8099
        }); 

        trains.push({
            icon : "train-api-sleep.png",
            code : "api-sleep",
            title : "게으른 토마스",
            contents : "외부 API 호출 서버, 상당히 게으르다",

            server : "api-server",
            params : [ {sleep : 1}, ],
            portStart : 8082,
            portEnd : 8082
        }); 
        

        trains.push({
            icon : "train-api-async.png",
            code : "api-async",
            title : "FLUX 토마스",
            contents : "난 FLUX API 토마스",

            server : "api-server",
            params : [],
            portStart : 8083,
            portEnd : 8089
        }); 

        trains.push({
            icon : "train-db-async.png",
            code : "db-async",
            title : "FLUX DB 토마스",
            contents : "난 FLUX DB 토마스",

            server : "database-server",
            params : [ {"--spring.profiles.active=" : "async"}, ],
            portStart : 8093,
            portEnd : 8099
        }); 

        return trains;
    }

    click(target, event){
        const input = this.findElements("input-box")[0];    
        const value = input.value;
        if( value.includes("FAILED") || Util.isEmpty(value) ){
            input.value = "FAILED: 비어있는 값";
            return;
        }; 

        const common = DocEngine.instance.common;
        const computerSpawner = common.computerSpawner;
        if ( this.isActiveComputer(computerSpawner) ){
            const activeComputer = computerSpawner.activeComputer;
            this.inLineCmd(activeComputer, input);
        }
    }

    clickFromTrainItem(train, item, cmdType, autoClick){
        const common = DocEngine.instance.common;
        const computerSpawner = common.computerSpawner;
        const input = this.findElements("input-box")[0];
        if ( this.isActiveComputer(computerSpawner) ){
            const { server, module, params } = item;
            const activeComputer = computerSpawner.activeComputer;

            let cmdContext = new CmdContext();
            cmdContext.cmd = cmdType;
            cmdContext.port = item.port;
            cmdContext.params = params;
            cmdContext.server = server;

            input.value = JSON.stringify(cmdContext);

            if(autoClick)
                this.click();
        }
        else{
            input.value = "FAILED: 타겟 컴퓨터를 선택하세요";
        }
    
        this.spawnTrainMatterObject(item);
    }

    spawnTrainMatterObject(item){
        const common = DocEngine.instance.common;
        console.log(common.renderer);
        const stageFactory = common.renderer.stageFactory;
        stageFactory.spawnTrain(item);
    }

    inLineCmd(computer, input){
        const contextJSON = input.value;
        const result = computer.isCheckServeStatus(contextJSON);
        if(result.isValid){
            computer.controlServerCmd(contextJSON);
            input.value = "";   
        }
        else{
            input.value = result.error;   
        }
    }

    isActiveComputer(computerSpawner){
        let flag = false;
        if(computerSpawner){
            flag = ( computerSpawner.activeComputer != null );
        }
        return flag;
    }

    set visible(value){

    }
}