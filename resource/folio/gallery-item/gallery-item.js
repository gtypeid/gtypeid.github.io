
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import HTTP from "../../../js/doc/HTTP.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import Gallery from "../gallery/gallery.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class GalleryItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._entityData;
        this._slider;
        this._eventHandler;
        this._widthSize = 320;
        this._heightSize = 240;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "detail-button");
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;
        const parent = this._entityData.comp.parent;
        const value = parent.scrollValue;
        this.scrollUpdate(value, -1);
        this.setElements(item);
        this.spawnSlider(item);
    }

    async spawnSlider(item){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._controlPanel){
            const spawnAttachData = {
                attachWidget : this,
                item : item
            }
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget( 
                this.findElements("slider-box")[0], "slider", spawnAttachData);
            this._slider = widget.widgetResource;
        }
        return this._slider;
    }

    click(target, event){
        const className = target.className;
        const profileButton = this.key.concat('-', "detail-button");
        const common = DocEngine.instance.common;
        const mainView = common.mainView;
        const helpView = mainView.helpView;

        if(className === profileButton){
            const profile = common.profile;
            profile.visible = true;
            this.updateHtmlItem(profile);
            helpView.helpOpen("detail-view");
        }
    }

    async updateHtmlItem(profile){
        const http = DocEngine.instance.http;
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const path = 
             "/resource/path/folio/html/" 
            + this._entityData.item.html;

        const   htmlRequest = {...HTTP.RequestType };
            htmlRequest.method = HTTP.ERequestMethod.GET;
            htmlRequest.acceptHeader = "text/html";
            htmlRequest.responseType = HTTP.EResponseType.Document;
            htmlRequest.URL =  path.concat('.html') ;

        const pHTML = new Promise(resolve => {
            http.doRequest(htmlRequest, (response) => {
                resolve(response);
            });
        });
        
        const response = await pHTML;
        const content = response.getElementsByClassName("content")[0];
        profile.updateContent(content, this._entityData.item);
    }

    setElements(item){

        const title = this.findElements("h-title")[0];
        const contentP = this.findElements("content-p")[0];

        title.innerHTML = item.title;
        contentP.innerHTML = item.thumcontent;
    }

    scrollUpdate(scrollValue, scrollIndex){
        const frame = this.findElements("frame")[0];
        const itemIndex = this._entityData.item.index;

        let position = (scrollIndex * (scrollValue) );

        if(itemIndex == scrollIndex){
            const append = 0;
            frame.style.left = position + append + 'px';
            this.active(true);
        }

        else if(itemIndex > scrollIndex){
            const parent = this._entityData.comp.parent;
            const append = parent.scrollValue;
            const size = this._widthSize + 20;
            position += ( (itemIndex - scrollIndex) * size ) + append - (size * 0.75);
            frame.style.left = position + 'px';
            this.active(false);
        }
    }

    
    active(value){
        const item = this._entityData.item;
        const frame = this.findElements("frame")[0];
        const activeBox = this.findElements("active-box")[0];
        const thumbnailImgWrap = this.findElements("thumbnail-img-wrap")[0];
        const thumbnailImg = this.findElements("thumbnail-img")[0];

        if(value){
            frame.style.width = this.getItemWidth();
            frame.style.height = this.getItemHeight();
            activeBox.style.display = "block";
            thumbnailImgWrap.style.display = "none";
        }
        else{
            frame.style.width = this._widthSize + "px";
            frame.style.height = this._heightSize + "px";
            activeBox.style.display = "none";
            thumbnailImgWrap.style.display = "block";
            const src = "/resource/path/folio/" + item.banner;
            thumbnailImg.src = src;
        }

        this.changeContent();
        if(value)
            this._slider.sliderUpdate(this.gallery.screenType);
    }

    changeContent(){
        const contentBox = this.findElements("content-box")[0];
        const contentP = this.findElements("content-p")[0];
        const type = this.gallery.screenType;

        if(type === Gallery.SCREEN.MIDDLE_SCREEN){
            contentBox.style.display = "block";
            contentP.style.fontSize = "19px";
        }
        else if(type === Gallery.SCREEN.FULL_SCREEN){
            contentBox.style.display = "flex";
            contentBox.style.alignItems = "center";
            contentBox.style.justifyContent = "spaceBetween";
            contentP.style.fontSize = "22px";
        }
    }

    getItemWidth(){
        const parent = this._entityData.comp.parent;
        return parent.scrollValue + "px";
    }

    getItemHeight(){
        const parent = this._entityData.comp.parent;
        return parent.gelleryHieght + "vh";
    }

    get gallery(){
        return this._entityData.comp.parent;
    }

}