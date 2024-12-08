
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HighlightSubtitle from "../../../js/comp/HighlightSubtitle.js";
import * as Util from "../../../js/doc/Util.js";

export default class Profile extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._highlighter;
        this._isActive = true;
        this._slider;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._highlighter = this.addComp(HighlightSubtitle);
        this._highlighter.onHighlightHandle = this.hlightHandle;
        this._highlighter.onViewTagOverHandle = this.overHandle;
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "flush-btn");
    }

    hlightHandle(element){
        const type = element.innerHTML;
        const cookie = Util.getCookie("img-help");
        if(type === "살펴보기" && Util.isEmpty(cookie) ){
            const common = DocEngine.instance.common;
            const mainView = common.mainView;
            const helpView = mainView.helpView;
            helpView.helpOpen("img-help");
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            
        }
    }

    overHandle(element){
        const common = DocEngine.instance.common;
        const mainView = common.mainView;
        const helpView = mainView.helpView;
        helpView.helpOpen("tag-help");
    }

    click(target, event){
        if(this._isActive){
            this.visible = false;
        }
        else{
            this.visible = true;
        }
    }

    mouseEnter(target, event){
        console.log(target);
    }

    set visible(value){
        this._isActive = value; 
        const frame = this.findElements("frame")[0];
        if(this._isActive){
            frame.style.display = "block";
        }
        else{
            frame.style.display = "none";
            this.clearInner();
        }
    }

    clearInner(){
        const selfContent = this.findElements("top")[0];
        selfContent.innerHTML = "";
    }

    updateContent(content, item){
        const selfContent = this.findElements("top")[0];
        this.clearInner();
        selfContent.appendChild(content);
        
        Util.sequenceTree(content, (element) => {
            const makeName = this.key.concat('-', element.className);
            if( element.localName !== "pre" || !Util.isEmpty( element.getAttribute("over") ))
                try {
                    element.className = makeName;
                } catch (error) {
                }

        });

        this.findElements("gram").forEach(it =>{
            mermaid.init( {
                theme: 'neutral'
                }, it);
        })
        
        PR.prettyPrint();
        this._highlighter.bindHighlight("content", "top");
        selfContent.scrollTo(0,0);

        this.updateSlider(item);
    }

    updateSlider(item){
        this.spawnSlider(item);
    }

    async spawnSlider(item){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._controlPanel){
            const spawnAttachData = {
                attachWidget : this,
                item : item,
                style : {
                    width : "70%",
                    height : "450px",
                    marginBottom : "50px"
                },
                option : {
                    thumBox : true,
                    zoomIn : true,
                    replay : true,
                    commentBox : true,
                    genType : "contents"
                }
            }
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget( 
                this.findElements("slider-box")[0], "slider", spawnAttachData);

            this._slider = widget.widgetResource;
        }
        return this._slider;
    }
}