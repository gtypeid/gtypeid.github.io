import Common from "../../doc/Common.js";
import DocEngine from "../../doc/DocEngine.js";
import HTMLPipeLine from "../../doc/HTMLPipeLine.js";
import * as Util from "../../doc/Util.js";

export default class CommonThomas extends Common{
    constructor(){
        super();
        this._endPoint;
        this._mainFrame;
    }


    get mainFrame(){
        if(!this._mainFrame){
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("main-frame");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._mainFrame = widget;
                return this._mainFrame;
            }
    
        }
        return this._mainFrame;
    }

    get monitor(){
        return this.mainFrame.monitor;
    }

    get renderer(){
        return this.mainFrame.renderer;
    }

    get computerSpawner(){
        return this.mainFrame.monitor.computerSpawner;
    }

    get face(){
        return this.mainFrame.face;
    }

    get endPoint(){
        return this._endPoint;
    }

    set endPoint(value){
        this._endPoint = value;
    }
}