
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";

export default class SliderTumbBox extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._spawnAttachData;
        this._eventHandler;
        this._entityGenerator;
        this._activeItem;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._entityGenerator = this.addComp(EntityGenerator);
    }

    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        const item = this._spawnAttachData.item.item;
        const style = spawnAttachData.item.style;
        if(style.height){
            this.findElements("frame")[0].style.height = style.height;
        }

        const titles = item.titles;
        this._entityGenerator.makeElements("container", "slider-tumb-item", titles);
    }
    
    activeIndex(index, isActiveUpdate){
        const result = this._entityGenerator.isGetMatchIndexEntity("slider-tumb-item", index);
        if(result.isValid){
            const entity = result.widgetResource;
            if(this._activeItem){
                this._activeItem.active(false);
            }
            this._activeItem = entity;
            this._activeItem.active(true);
            if(isActiveUpdate){
                const parent = this._spawnAttachData.attachWidget;
                parent.updateTumbBox(index);
            }
        
        }
    }
}