
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import EyesController from "./EyesController.js";

export default class Face extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._faceContext;
        this._eventHandler;
        this._eyesController;
        this._thomasBlaster;
    }

    async rConstructor(){
        super.rConstructor();
        this._faceContext = {
            width : 200,
            height : 200,
            left : 375,
            top : 25,
            eyesPoint : 58,
            eyesPadding : 40,
            eyesMaxMove : 5.5
        }
        const faceContext = this._faceContext;
        const frame = this.findElements("frame")[0];
        const eyesBox = this.findElements("eyes-box")[0];
        this.setFace(frame, faceContext);
        this._eyesController = new EyesController(eyesBox, faceContext);
        this._eventHandler = this.addComp(DocEventHandler);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_MOVE, document);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_DOWN, frame);

        this._thomasBlaster = await this.spawnThomasBlasterWidget();
        this._thomasBlaster.visible = false;
    }

    setFace(frame, faceContext){
        frame.style.width = faceContext.width + 'px';
        frame.style.height = faceContext.height + 'px';
        frame.style.left = faceContext.left + 'px';
        frame.style.top = faceContext.top + 'px';
    }

    mouseMove(target, event){
        this._eyesController.mouseMove(event);
    }
    
    mouseDown(target, event){
        console.log(target)
        if(event.which > 1 || event.shiftKey){
            this._eyesController.click();
        }
        else if(event.which == 1){
            const visible = this._thomasBlaster.visible;
            visible ? this._thomasBlaster.visible = false :
                     this._thomasBlaster.visible = true;
        }
    }

    async spawnThomasBlasterWidget(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._thomasBlaster){
            const spawnAttachData = {
                attachWidget : this,
                item : ""
            }
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(document.body, "thomas-blaster", spawnAttachData);
            this._thomasBlaster = widget.widgetResource;
        }
        return this._thomasBlaster;
    }

    get faceContext(){
        return this._faceContext;
    }

    get eyesController(){
        return this._eyesController;
    }

    get dir(){
        return this._eyesController.dir;
    }

    get leftEyePosition(){

    }

    get rightEyePosition(){

    }
}