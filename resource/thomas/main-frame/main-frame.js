
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";

export default class MainView extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   

        this._renderer;
        this._face;
        this._monitor;
    }

    rConstructor(){
        super.rConstructor();
        this.spawnMonitorWidget();
        this.spawnRenderWidget();
        
    }

    async spawnMonitorWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._monitor){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "monitor");
            this._monitor = widget.widgetResource;
        }
        return this._monitor;
    }

    async spawnRenderWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._renderer){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "renderer");
            this._renderer = widget.widgetResource;
            this.spawnFaceWidget();
        }
        return this._renderer;
    }

    async spawnFaceWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._face){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "face");
            this._face = widget.widgetResource;
        }
        return this._face;
    }

    get face(){
        return this._face;
    }

    get monitor(){
        return this._monitor;
    }

    get renderer(){
        return this._renderer;
    }
}