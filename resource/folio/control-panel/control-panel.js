
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";
import Gallery from "../gallery/gallery.js";


export default class ControlPanel extends WidgetResource{

    constructor(cwrd){
        super(cwrd);   
        this._eventHandler;
    }

    rConstructor(){
        super.rConstructor();
        this._eventHandler = this.addComp(DocEventHandler);
        const eh = this._eventHandler;
        eh.bindEvent(DocEventHandler.EEvent.CLICK, "profile-button");
        eh.bindEvent(DocEventHandler.EEvent.CHANGE, this.findElements("select")[0]);
        eh.bindEvent(DocEventHandler.EEvent.CHANGE, this.findElements("select")[1]);
    }

    click(target, event){
        const className = target.className;
        const profileButton = this.key.concat('-', "profile-button");

        const common = DocEngine.instance.common;
        if(className === profileButton){
            const helpView = common.mainView.helpView;
            helpView.helpOpen("main-help", true);
        }
    }

    change(target, event){
        const value = target.value;
        if( value === "asc" ||
            value === "desc" 
             ){
            this._orderType = value;
        }
        else if( value === "all" ||
                 value === "backend" ||
                 value === "publisher" 
                  ){
            this.changeGallery(value)
        }

    }

    changeGallery(value){
        const mainView = DocEngine.instance.common.mainView;
        const { backEndGallery, publisherGallery } = mainView;

        if(value === "all"){
            backEndGallery.setScreen(Gallery.SCREEN.MIDDLE_SCREEN);
            publisherGallery.setScreen(Gallery.SCREEN.MIDDLE_SCREEN);
        }
        else if (value === "backend"){
            backEndGallery.setScreen(Gallery.SCREEN.FULL_SCREEN);
            publisherGallery.setScreen(Gallery.SCREEN.NONE);

        } else if (value === "publisher"){
            backEndGallery.setScreen(Gallery.SCREEN.NONE);
            publisherGallery.setScreen(Gallery.SCREEN.FULL_SCREEN);
        }

    }

}