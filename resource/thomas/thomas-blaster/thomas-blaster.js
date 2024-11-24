
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";

export default class ThomasBlaster extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._thomasBlasterContext;
        this._spawnAttachData;
        this._isVisible;
    }

    rConstructor(){
        super.rConstructor();
        this._thomasBlasterContext = {
            width : 325,
            height : 550
        }
    }

    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        const {attachWidget, item} = spawnAttachData;
        const faceContext = attachWidget.faceContext;
        const {width, left, top} = faceContext;

        const adjust = 10;
        const calcLeft = width + left + adjust;

        const frame = this.findElements("frame")[0];
        frame.style.left = calcLeft + 'px';
        frame.style.top = top + 'px';
    }

    set visible(value){
        const frame = this.findElements("frame")[0];
        const {width, height } = this._thomasBlasterContext;
        this._isVisible = value;
        if(value){
            frame.style.width = width + 'px';
            frame.style.height = height + 'px';
        }
        else{
            frame.style.width = '0px';
            frame.style.height = '0px';
        }
    }

    get visible(){
        return this._isVisible;
    }

}