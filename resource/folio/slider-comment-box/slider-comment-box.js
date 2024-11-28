
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class SliderCommentBox extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._spawnAttachData;
    }

    rConstructor(){
        super.rConstructor();
    }

    update(comment){
        const p = this.findElements("p")[0];
        p.innerHTML = comment;
    }

    spawnAttach(spawnAttachData){
        this._spawnAttachData = spawnAttachData;
        const p = this.findElements("frame")[0];
        p.classList.add("profile-folded-corner");
    }
}