
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
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "flush-btn");
    }

    click(target, event){
        if(this._isActive){
            this.visible = false;
        }
        else{
            this.visible = true;
        }
    }

    set visible(value){
        this._isActive = value; 
        const frame = this.findElements("frame")[0];
        if(this._isActive){
            frame.style.display = "block";
        }
        else{
            frame.style.display = "none";
        }
    }

    updateContent(content, item){
        const selfContent = this.findElements("top")[0];
        selfContent.innerHTML = "";
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
                    height : "475px",
                    marginBottom : "50px"
                },
                option : {
                    thumBox : true,
                    zoomIn : true,
                    replay : true,
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