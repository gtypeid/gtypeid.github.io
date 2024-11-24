
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class MonitorIcon extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._eventHandler;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "frame");
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;
        const src = "/resource/path/" + item.src;
        const icon = this.findElements("icon")[0];
        icon.src = src;
    }

    click(target, event){
        const comp = this._entityData.comp;
        const parent = comp.parent;
        const wr = parent.widget.widgetResource;
        wr.iconClick(this, this._entityData.item);
    }

    
}