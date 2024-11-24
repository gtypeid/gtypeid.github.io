
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import ComputerRepository from "./ComputerRepository.js";
import * as Util from "../../../js/doc/Util.js";

export default class Computer extends WidgetResource{
    static isRuleBeat = false;
    constructor(cwrd){
        super(cwrd);   

        this._isBeat;
        this._entityData;
        this._eventHandler;
        this._socket;
        this._computerRepository;
    }

    rConstructor(){
        super.rConstructor();
        
        this._computerRepository = new ComputerRepository();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "frame");

        if(!Computer.isRuleBeat){
            const style = '@keyframes beat{ to { transform: scale(1.04); } }';
            document.styleSheets[0].insertRule(style);
            Computer.isRuleBeat = true;
        }

        this.setBeat( false );
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;
        this.setPosition(item.x, item.y);
    }

    setPosition(x, y){

        const frame = this.findElements("frame")[0];
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        const { wSize, hSize } = wr.layout;

        frame.style.left = (x * wSize)  + 'px';
        frame.style.top = (y * hSize) + 'px';
    }


    click(target, event){
        if(this._isBeat) {
            this.active();
        }
        else{
            this.tryConnect();
        }

    }

    active(){
        if(this._isBeat){
            const comp = this._entityData.comp;
            const parent = comp.parent
            const wr = parent.widget.widgetResource;
            wr.setActiveComputer(this);
        }
    }

    disible(){
        
    }

    isCheckServeStatus(contextJSON){
        let result = {
            isValid : false,
            error : "FAILED: defaultError"
        };

        const cmdContext = JSON.parse(contextJSON);
        if(Util.isEmpty(cmdContext)) {
            result.error = "FAILED: 잘못된 CmdContext";
            return result;
        }

        result = this.stepClientCheck(cmdContext);
        return result;
    }

    stepClientCheck(cmdContext){
        return this._computerRepository.isMatch(cmdContext);
    }
    
    controlServerCmd(msg){
        this._socket.send( msg );
    }

    tryConnect(){
        const { url } = this._entityData.item;
        const port = 8090;
        this._socket = new WebSocket('ws://' + url + ':' + port + '/api/connect');

        this._socket.onopen = (event) => {
            console.log('Connected to WebSocket server.');
            this.setBeat(true);
            this.active();
        };

        this._socket.onmessage = (event) =>{
            console.log('Message from server:', event.data);
        };

        this._socket.onclose = (event) => {
            console.log('Disconnected from WebSocket server.');
            this.setBeat(false);
        };

        this._socket.onerror = function(error) {
            console.log('WebSocket Error:', error);
        };
    }


    setBeat(value){
        this._isBeat = value;
        const img = this.findElements("computer-img")[0];
        const className = "computer-computer-beat";
        if(value){
            if(!img.classList.contains(className))
                img.classList.add(className);
            img.style.filter = 'grayscale(0%)';
        }
        else{
            if(img.classList.contains(className))
                img.classList.remove(className);
            img.style.filter = 'grayscale(100%)';
        }
    }

    get computerInfo(){
        return this._entityData.item;
    }

    get name(){
        return this._entityData.item.name;
    }
    
    get url(){
        return this._entityData.item.url;
    }
    

}