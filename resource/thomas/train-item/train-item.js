
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class TrainItem extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   

        this._entityData;
        this._eventHandler;
        this._trainRunnerView;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, "img-box");
    }

    entityBind(entityData){
        this._entityData = entityData;
        const item = this._entityData.item;
        const {icon, title, contents, portStart, portEnd} = item;

        const src = "/resource/path/" + icon;
        const trainIcon = this.findElements("train-img")[0];
        trainIcon.src = src;

        const trainTitle = this.findElements("title")[0];
        trainTitle.innerHTML = title;

        const trainContents = this.findElements("contents")[0];
        trainContents.innerHTML = contents;

        const trainPort = this.findElements("port")[0];
        trainPort.innerHTML = "Port : " + portStart + " - " + portEnd;

        this.spawntrainRunnerViewWidget();
    }

    click(target, event){
        this.toClick("run", false);
    }

    toClick(cmdType, autoRun){
        const comp = this._entityData.comp;
        const parent = comp.parent
        const wr = parent.widget.widgetResource;

        const newItem = {...this._entityData.item};
        newItem.port = this._trainRunnerView.port;

        wr.clickFromTrainItem(this, newItem, cmdType, autoRun);
    }

    async spawntrainRunnerViewWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._trainRunnerView){
            const spawnAttachData = {
                attachWidget : this,
                item : this._entityData.item
            }
            const controlBox = this.findElements("control-box")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(controlBox, "train-runner-view", spawnAttachData);
            this._trainRunnerView = widget.widgetResource;
        }
        return this._trainRunnerView;
    }
}