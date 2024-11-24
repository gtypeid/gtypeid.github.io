
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class SliderItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._eventHandler;
        
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
    }

    entityBind(entityData){
        this._entityData = entityData;
        
        const item = this._entityData.item;
        const parent = this._entityData.comp.parent;

        const src = "/resource/path/folio/" + item;
        const img = this.findElements("img")[0];
        img.src = src;
    }

    replay(){
        const img = this.findElements("img")[0];
        const src = img.src;
        img.src = "";
        img.src = src;
    }
}