import Common from "../../doc/Common.js";
import * as Util from "../../doc/Util.js";

export default class ComCam extends Common{
    constructor(){
        super();
        this._endPoint;
    }


    get endPoint(){
        return this._endPoint;
    }

    set endPoint(value){
        this._endPoint = value;
    }
}