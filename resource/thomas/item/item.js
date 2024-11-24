
import WidgetResource from "../../../js/doc/WidgetResource.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import LinkChain from "./LinkChain.js";

export default class Item extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
        this._isClick;
        this._frame;

        this._linkChain;
        this._x;
        this._y;
    }
    
    rConstructor(){
        super.rConstructor();
        this._frame = this.findElements("frame")[0];
        this._eventHandler = this.addComp(DocEventHandler);
        this._linkChain = new LinkChain();

        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_DOWN, "frame");
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_UP, "frame");
        eh.bindEvent(DocEventHandler.EEvent.MOUSE_MOVE, document);
    }

    chainRequestLink(item){
        const nextTarget = this._linkChain.addNext(item);
        nextTarget.linkChain.addPrev(this);

    }

    disconnectLink(item){
        this._linkChain.removeNext(item);
        item.linkChain.removePrev(this);
    }

    mouseDown(target, event){
        this._isClick = true;
        this._frame.style.zIndex = "99";
    }

    mouseUp(target, event){
        if(this._isClick){
            this._isClick = false;
            this._frame.style.zIndex = "0";
        }
    }

    mouseMove(target, event){
        if(this._isClick){

            this._x = event.pageX;
            this._y = event.pageY;

            const pxX = this._x + "px";
            const pxY = this._y + "px";

            this._frame.style.left = pxX;
            this._frame.style.top = pxY;
        }
    }

    get linkChain(){
        return this._linkChain;
    }

    get x(){
        return this._x;
    }

    get y(){
        return this._y;
    }

    set x(value){
        this._x = value;
    }

    set y(value){
        this._y = value;
    }
}