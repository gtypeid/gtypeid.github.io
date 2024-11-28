
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";
import Gallery from "../gallery/gallery.js";
import * as Util from "../../../js/doc/Util.js";

export default class Slider extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._entityGenerator;
        this._spawnAttachData;
        this._activeIndex = 0;
        this._maxItemSize;
        this._isZoom = false;
        this._sliderTumbBox;
        this._sliderCommentBox;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._entityGenerator = this.addComp(EntityGenerator);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "left-arrow");
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "right-arrow");
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "zoom-in-button");
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "replay-button");
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "zoom-close-button");
        
    }

    async spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        let genItems = spawnAttachData.item.thumimgs;
        const option = this._spawnAttachData.option;
        if(option && option.genType === "contents"){
            genItems = spawnAttachData.item.imgs;
        }
        this._maxItemSize = genItems.length;
        this._entityGenerator.makeElements("container", "slider-item", genItems);
        this.updateItemPage();

        const style = this._spawnAttachData.style;
        if(style){
            const slider = this.findElements("frame")[0];
            for (let property in style) {
                slider.style[property] = style[property];
            }

        }

        if(option){
            if(option.zoomIn){
                const zoomIn = this.findElements("zoom-in-button")[0];
                zoomIn.style.display = "block";
            }
            if(option.replay){
                const replay = this.findElements("replay-button")[0];
                replay.style.display = "block";
            }
            if(option.thumBox){
                this._sliderTumbBox = this.spawnSliderTumbBox(this._spawnAttachData);
            }
            if(option.commentBox){
                this._sliderCommentBox = await this.spawnCommentBox();
                this.updateCommentBox();
            }

        }
    }


    click(target, event){
        const className = target.className;
        const leftArrow = this.key.concat('-', "left-arrow");
        const rightArrow = this.key.concat('-', "right-arrow");
        const zoomButton = this.key.concat('-', "zoom-in-button");
        const replayButton = this.key.concat('-', "replay-button");
        const zoomCloseButton = this.key.concat('-', "zoom-close-button");

        if(className === leftArrow){
            --this._activeIndex;
            if(this._activeIndex < 0){
                this._activeIndex = this._maxItemSize - 1;
            }
        }

        if(className === rightArrow){
            ++this._activeIndex;
            if(this._activeIndex >= this._maxItemSize){
                this._activeIndex = 0;
            }
        }

        if(className === zoomButton){
            this.visibleZoomIn(true);
        }

        if(className === zoomCloseButton){
            this.visibleZoomIn(false);
        }

        if(className === replayButton){
            this.replay();
        }

        this.updateItemPosition();
    }

    replay(){
        const result = this._entityGenerator.isGetMatchIndexEntity("slider-item", this._activeIndex);
        if(result.isValid){
            const entity = result.widgetResource;
            const item = entity._entityData.item;
            if(item.includes(".gif")){
                entity.replay();
            }
        }
    }

    visibleZoomIn(value){
        this._isZoom = value;
        const zoomView = this.findElements("zoom-view")[0];
        if(this._isZoom){
            zoomView.style.display = "block";
            this.zoomImgUpdate();
        }
        else{
            zoomView.style.display = "none";
        }
    }

    zoomImgUpdate(){
        const img = this.findElements("item-img")[this._activeIndex];
        const imgView = this.findElements("zoom-img")[0];
        imgView.src = img.src;
    }

    updateItemPosition(){
        const imgs = this.findElements("item-frame");
        const i = this._activeIndex;
        
        for(let i = 0; i < imgs.length; ++i){
            imgs[i].style.left = "300px";
            imgs[i].style.widht = "0%";
            imgs[i].style.height = "0%";
        }

        imgs[i].style.display = "block";
        imgs[i].style.left = "0px";
        imgs[i].style.widht = "100%";
        imgs[i].style.height = "100%";

        this.updateItemPage();
    }
    
    updateItemPage(){
        const page = this.findElements("page")[0];
        page.innerHTML = this._activeIndex + 1 + "/" + this._maxItemSize;  

        if(this._sliderTumbBox){
            this._sliderTumbBox.activeIndex(this._activeIndex, false);
        }

        if(this._sliderCommentBox){
            this.updateCommentBox();
        }

        this.replay();
    }

    updateCommentBox(){
        const item = this._spawnAttachData.item.comments;
        const comment = item[this._activeIndex];
        this._sliderCommentBox.update(comment);
    }
    
    updateTumbBox(index){
        this._activeIndex = index;
        this.updateItemPosition();
    }


    sliderUpdate(screenType){
        this.updateItemPosition();
    }

    async spawnSliderTumbBox(item){

        const parent = this.findElements("frame")[0].parentNode;
        parent.style.display = "flex";
        parent.style.justifyContent = "flex-start";

        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const spawnAttachData = {
            attachWidget : this,
            item : item,
        }
        const widget = await htmlPipeLine.asyncRunTimeSpawnWidget( 
            parent, "slider-tumb-box", spawnAttachData);
            
        this._sliderTumbBox = widget.widgetResource;
        return this._sliderTumbBox;
    }

    async spawnCommentBox(){
        const parent = this.findElements("c-wrap")[0];
        parent.style.height = "60px";
        parent.style.position = "absolute";
        parent.style.bottom = "-25px";
        parent.style.left = "-50px";

        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const spawnAttachData = {
            attachWidget : this
        }
        const widget = await htmlPipeLine.asyncRunTimeSpawnWidget( 
            parent, "slider-comment-box", spawnAttachData);
            
        this._sliderCommentBox = widget.widgetResource;
        return this._sliderCommentBox;
    }
}