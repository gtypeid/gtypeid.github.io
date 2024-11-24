import Common from "../../doc/Common.js";
import DocEngine from "../../doc/DocEngine.js";
import HTMLPipeLine from "../../doc/HTMLPipeLine.js";
import * as Util from "../../doc/Util.js";

export default class CommonFolio extends Common{
    constructor(){
        super();
        this._mainView;
    }


    get mainView(){
        if(!this._mainView){
            const htmlPipeLine = DocEngine.instance.htmlPipeLine;
            const result = htmlPipeLine.isGetWidgets("main-view");
            if(result.isValid){
                const widget = result.widget.widgetResource;
                this._mainView = widget;
                return this._mainView;
            }
    
        }
        return this._mainView;
    }

    get profile(){
        return this.mainView.profile;
    }

}