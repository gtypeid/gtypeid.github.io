
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class SliderTumbItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._eventHandler;
        
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "frame");
    }

    click(target, event){
        const className = target.className;
        const frame = this.key.concat('-', "frame");
        if(className === frame){
            const parent = this._entityData.comp.parent;
            parent.activeIndex(this._entityData.index, true);
        }
    }

    entityBind(entityData){
        this._entityData = entityData;
        const itemP = this.findElements("item")[0]; 
        itemP.innerHTML = this._entityData.item;
        
        const itemImg = this.findElements("item-img")[0];
        if(this._entityData.item.includes("시연")){
            itemImg.style.display = "inline-block";
            itemP.style.fontSize = "large";
        }
        else{
            itemImg.style.display = "none";
            itemP.style.fontSize = "normal";
        }

        this.findElements("frame")[0].setAttribute("item-index", this._entityData.index);
        this.active(false);
        const parent = this._entityData.comp.parent;
        parent.activeIndex(0, true);
    }

    active(value){
        const itemP = this.findElements("item")[0];
        if(value){
            itemP.style.color = "green";
            itemP.style.fontWeight = "bold";
        }
        else{
            itemP.style.color = "black";
            itemP.style.fontWeight = "normal";
        }
    }

    get frame(){
        return this.findElements("frame")[0];
    }
}