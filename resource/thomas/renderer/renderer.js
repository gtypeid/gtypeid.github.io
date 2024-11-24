
import DocEngine from "../../../js/doc/DocEngine.js";
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import * as Util from "../../../js/doc/Util.js";
import MatterEngine from "./MatterEngine.js";
import StageFactory from "./StageFactory.js";

export default class Renderer extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._matterCanvasOptions;
        this._canvas;
        this._ctx;
        this._matterEngine;
        this._stageFactory;
    }

    rConstructor(){
        super.rConstructor();
        this._matterCanvasOptions = {
            width: 1600,
            height: 700,
            background: 'white',
            wireframeBackground: '#2f3aa7',
            wireframes: false,
            // showAngleIndicator: true
        }
        this._eventHandler = this.addComp(DocEventHandler);
        this._matterEngine = new MatterEngine( this.inItMatterCanvas() );
        this._eventHandler.bindEvent(DocEventHandler.EEvent.CLICK, document);
        this._eventHandler.bindEvent(DocEventHandler.EEvent.MOUSE_MOVE, document);
        this._stageFactory = new StageFactory(this, this._matterEngine);
    }

    click(target, event){
        
        const {x, y} = event;
        const {scaleX, scaleY} = this.getScale();
        const item = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE, 
            [x * scaleX, y * scaleY, 15, 15]
        );

        //this.spawnBlaster(event);
    }

    mouseMove(target, event){
        /*
        const {x, y} = event;
        const {scaleX, scaleY} = this.getScale();
        const item = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE, 
            [x * scaleX, y * scaleY, 15, 15]
        );
        */

        //this.spawnBlaster(event);
    }

    spawnBlaster(event){
        const common = DocEngine.instance.common;
        const face = common.face;
        const eyesController = face.eyesController;
        const dir = face.dir;

        const plan = this._stageFactory.plan;
        const optnion = {
            randX : 5,
            randY : 5,
            time : 40,
            rate : 10
        }
        this._stageFactory.shakeObject(plan, optnion);

        const {scaleX, scaleY} = this.getScale();
        const power = 0.09;
        for(let i = 0; i < 2; ++i){
            const eyes = eyesController.getPosition(i);
            this._stageFactory.spawnBlaster(eyes.left * scaleX, eyes.top * scaleY, dir, power);
        }

    }


    inItMatterCanvas(){
        const frame = this.findElements("frame")[0];
        this._canvas = this.findElements("canvas")[0];
        this._ctx = this._canvas.getContext("2d");
        return [this, this._canvas, this._matterCanvasOptions];
    }

    get matterEngine(){
        return this._matterEngine;
    }

    get matterCanvasOptions(){
        return this._matterCanvasOptions;
    }

    get stageFactory(){
        return this._stageFactory;
    }

    /*
    drawNextLine(self){
        const next = self.linkChain.next;
        for(let it of next){

            const { scaleX, scaleY } = this.getScale();
            const selfX = (self.x + 150) * scaleX;
            const selfY = self.y * scaleY;
            const itX = it.x * scaleX;
            const itY = it.y * scaleY;
            const style = {
                color : 'red',
                size : 3
            }
            this.drawLine(selfX, selfY, itX, itY, style);
            this.drawPrevLine(it);
        }
    }

    drawPrevLine(self){
        const prev = self.linkChain.prev;
        for(let it of prev){

            const { scaleX, scaleY } = this.getScale();
            const selfX = self.x * scaleX;
            const selfY = (self.y + 150) * scaleY;
            const itX = ( it.x + 150) * scaleX;
            const itY = ( it.y + 150) * scaleY;
            const style = { 
                color : 'green',
                size : 3
            }
            this.drawLine(selfX, selfY, itX, itY, style);
        }
    }

    drawLine(startX, startY, endX, endY, style){
        const {color, size} = style;

        this._ctx.beginPath(); 
        this._ctx.moveTo(startX, startY); 
        this._ctx.lineTo(endX, endY); 
        this._ctx.strokeStyle = color;
        this._ctx.lineWidth = size;
        this._ctx.stroke();
    }
    */

    getScale(){
        const styleWidth = this._canvas.clientWidth;
        const styleHeight = this._canvas.clientHeight;

        const actualWidth = this._canvas.width;
        const actualHeight = this._canvas.height;

        const scaleX = actualWidth / styleWidth;
        const scaleY = actualHeight / styleHeight;
        return {scaleX, scaleY};
    }


}