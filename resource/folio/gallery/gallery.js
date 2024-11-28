
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";

export default class Gallery extends WidgetResource{

    static SCREEN = {
        NONE : 0,
        FULL_SCREEN : 1,
        MIDDLE_SCREEN : 2
    }

    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._entityGenerator;
        this._scrollLock = false;
        this._scrollValue;
        this._galleryHeight = 44;
        this._scrollIndex = -1;
        this._spawnAttachData;
        this._folioItems = [];

        this._screenType = Gallery.SCREEN.MIDDLE_SCREEN;
    }

    rConstructor(){
        super.rConstructor();
        this._scrollValue = window.innerWidth * 0.70;
        this._eventHandler = this.addComp(DocEventHandler);
        this._entityGenerator = this.addComp(EntityGenerator);

        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_ENTER, "container");
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_LEAVE, "container");
        eh.bindEvent(DocEventHandler.EEvent.WHEEL, "container");
        eh.bindEvent(DocEventHandler.EEvent.WHEEL, "arrow");    
    }

    
    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        const itme = spawnAttachData.item;


        let i = 0;
        for (const key in itme) {
            const item = itme[key];
            item.index = i++;
            this._folioItems.push(item);
        }   

        this._entityGenerator.makeElements("line-box", "gallery-item", this._folioItems);
    }

    mouseEnter(target, event){
    }

    mouseLeave(target, event){
    }

    wheel(target, event){
        if(this._scrollLock) return;
        this._scrollLock = true;
        const size = this._folioItems.length;

        setTimeout( ()=> {
            this._scrollLock = false;
        }, 500);
        event.preventDefault();
        
        const dir = ( event.deltaY > 0) ? 1 : -1;
        if(dir > 0){
            if(this._scrollIndex == (size - 1)){
                return;
            }
            this._scrollIndex++;
        }
        else{
            if(this._scrollIndex == (-1)){
                return;
            }
            this._scrollIndex--;
        }

        if(this._scrollIndex < 0){
            this.visibleArrow(true);
        }
        else{
            this.visibleArrow(false);
        }

        const move = this._scrollValue * dir;
        target.scrollLeft += move;
        if(this._scrollIndex == 0){
            target.scrollLeft = 0;
        }

        const store = this._entityGenerator.getStore("gallery-item");
        store.forEach( it =>{
            it.scrollUpdate(this._scrollValue, this._scrollIndex);
        });
    }

    setScreen(type){
        const frame = this.findElements("frame")[0];
        this._screenType = type;

        switch(type){
            case Gallery.SCREEN.NONE :{
                frame.style.display = "none";
            }
            break;

            case Gallery.SCREEN.FULL_SCREEN :{
                const size = 90;
                frame.style.display = "block";
                frame.style.height = size + "vh";
                this._galleryHeight = size - 1;
            }
            break;

            case Gallery.SCREEN.MIDDLE_SCREEN : {
                const size = 45;
                frame.style.display = "block";
                frame.style.height = size + "vh";
                this._galleryHeight = size - 1;
            }
            break;
        }

        const store = this._entityGenerator.getStore("gallery-item");
        store.forEach( it =>{
            it.scrollUpdate(this._scrollValue, this._scrollIndex);
        });
    }

    visibleArrow(value){
        const arrow = this.findElements("arrow")[0];
        if(value){
            arrow.style.display = "block";
        }
        else{
            arrow.style.display = "none";
        }
    }

    get scrollValue(){
        return this._scrollValue;
    }

    get gelleryHieght(){
        return this._galleryHeight;
    }

    get screenType(){
        return this._screenType;
    }
}