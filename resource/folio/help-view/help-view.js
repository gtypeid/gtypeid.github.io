
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
                comment : "해당 영역 내 마우스 스크롤을 이용해<br>다음, 이전 아이템으로 이동 합니다.",
            },
            {
                src : "help1.gif",
                comment : "자세히 보기를 통해<br>프로젝트의 상세 내역을 확인할 수 있습니다."
            },
            {
                src : "help2.gif",
                comment : "목차를 선택하면 원하는 부분으로 빠르게 이동할 수 있습니다."
            },
            {
                src : "help3.gif",
                comment : "이미지 살펴보기 입니다.<br>아이템을 선택하여 프로젝트의 이미지를 살펴볼 수 있습니다.<br>⭐은 GIF로 재생됩니다."
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
        const img = this.findElements("zoom-img")[0];
        if(this._isZoom){
            zoomView.style.display = "block";
        }
        else{
            img.src = "/resource/path/loading.gif";
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

    helpOpen(type, force = false){
        if(force){
            Util.deleteCookie("main-help");
            Util.deleteCookie("detail-view");
            Util.deleteCookie("tag-help");
            Util.deleteCookie("img-help");
            alert("도움말 쿠키 삭제");
        }

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
        else if(type === "tag-help"){
            if(Util.isEmpty(cookie)){
                Util.setCookie(type, "ture", 3000);
                this.visibleZoomIn(true);
                this.helpViewUpdate(2);
            }
        }
        else if(type === "img-help"){
            if(Util.isEmpty(cookie)){
                Util.setCookie(type, "ture", 3000);
                this.visibleZoomIn(true);
                this.helpViewUpdate(3);
            }
        }
    }
}