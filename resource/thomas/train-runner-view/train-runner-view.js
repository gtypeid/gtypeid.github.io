
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";


const plusButton = "plus-button";
const minusButton = "minus-button";
const pushButton = "push-button";
const deleteButton = "delete-button";

export default class TrainRunnerView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._spawnAttachData;

        this._inputBox;
        this._inputPortValue;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, plusButton);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, minusButton);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, pushButton);  
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, deleteButton);
    }

    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        this._inputBox = this.findElements("port-input")[0];

        const item = this._spawnAttachData.item;
        const {server ,module, params, portStart, portEnd} = item;
        this._inputPortValue = Number(portStart);
        this._inputBox.value = this._inputPortValue;
    }

    click(target, event){
        const buttonPlus = this.key.concat('-', plusButton);
        const buttonMinus = this.key.concat('-', minusButton);
        const buttonPush = this.key.concat('-', pushButton);
        const buttonDelete = this.key.concat('-', deleteButton);

        if( target.classList.contains(buttonPlus) ){
            if( this.isCheckPort("plus") ){
                this._inputBox.value = this._inputPortValue;
            }
        }       
        if( target.classList.contains(buttonMinus) ){
            if( this.isCheckPort("minus") ){
                this._inputBox.value = this._inputPortValue;
            }
        }   

        if( target.classList.contains(buttonPush) ){
            const trainItem = this._spawnAttachData.attachWidget;
            trainItem.toClick("run", true);
        }   
        if( target.classList.contains(buttonDelete) ){
            const trainItem = this._spawnAttachData.attachWidget;
            trainItem.toClick("exit", true);
        }   
    }

    updateServerList(){
        
    }

    isCheckPort(param){
        let flag = false;

        const item = this._spawnAttachData.item;
        const {server, module, params, portStart, portEnd} = item;
        const nMax = Number(portEnd);
        const nMin = Number(portStart);
        if(param === "plus"){
            if(nMax > this._inputPortValue){
                flag = true;
                ++this._inputPortValue;
            }
        }
        else if(param === "minus"){
            if(this._inputPortValue > nMin){
                flag = true;
                --this._inputPortValue;
            }
        }
        
        return flag;
    }

    get port(){
        return this._inputPortValue;
    }

}