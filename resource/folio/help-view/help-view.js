
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import * as Util from "../../../js/doc/Util.js";

export default class HelpView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._isZoom = false;
        this._spawnAttachData;
        this._data = [
            {
                src : "help0.gif",
                comment : "백엔드 및 웹 퍼블리셔 커리큘럼 과정 작업물을 정리해보았습니다.<br>해당 카테고리 영역 내 스크롤을 이용해 위아래로 이동할 수 있습니다.",
            },
            {
                src : "help1.gif",
                comment : "목차를 선택하면 원하는 부분으로 빠르게 이동할 수 있습니다."
            }
        ]
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "zoom-close-button");
    }

    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
    }

    click(target, event){
        const className = target.className;
        const zoomCloseButton = this.key.concat('-', "zoom-close-button");
        if(className === zoomCloseButton){
            this.visibleZoomIn(false);
        }
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

    visibleZoomIn(value){
        this._isZoom = value;
        const zoomView = this.findElements("zoom-view")[0];
        if(this._isZoom){
            zoomView.style.display = "block";
        }
        else{
            zoomView.style.display = "none";
        }
    }

    helpViewUpdate(index){
        const imgView = this.findElements("zoom-img")[0];
        const commentP = this.findElements("comment")[0];
        const src = "/resource/path/folio/" + this._data[index].src;
        imgView.src = src;
        commentP.innerHTML = this._data[index].comment;
    }

    helpOpen(type){
        const cookie = Util.getCookie(type);
        if(type === "main-help"){
            if(Util.isEmpty(cookie)){
                Util.setCookie(type, "ture", 3000);
                this.visibleZoomIn(true);
                this.helpViewUpdate(0);
            }
        }
        else if(type === "detail-view"){
            if(Util.isEmpty(cookie)){
                Util.setCookie(type, "ture", 3000);
                this.visibleZoomIn(true);
                this.helpViewUpdate(1);
            }
        }

    }
}