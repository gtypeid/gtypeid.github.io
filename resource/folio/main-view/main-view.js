
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";

import * as FolioBackend from "../../../js/data/folio/Backend.js";
import * as FolioPublisher from "../../../js/data/folio/Publisher.js";

export default class MainView extends WidgetResource {
    constructor(cwrd){
        super(cwrd);   
        this._profile;
        this._gallery;
        this._controlPanel;
    }

    rConstructor(){
        super.rConstructor();
        this._gallery = new Map();
        this.spawnProfile();
        this.spawnGalleryWidget("backend", FolioBackend);
        this.spawnGalleryWidget("publisher", FolioPublisher, async ()=>{
            this._controlPanel = await this.spawnControlPanel();
            //this._controlPanel.changeGallery("backend");
        });
    }

    async spawnProfile(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._profile){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "profile");
            this._profile = widget.widgetResource;
            this._profile.visible = false;
        }
        return this._profile;
    }

    async spawnGalleryWidget(type, folioData, cb){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const has = this._gallery.has(type);
        if(!has){
            const spawnAttachData = {
                attachWidget : this,
                item : folioData
            }
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "gallery", spawnAttachData);
            this._gallery.set(type, widget.widgetResource);
            if(cb)
                cb();
        }
    }

    async spawnControlPanel(){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        if(!this._controlPanel){
            const frame = this.findElements("frame")[0];
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(frame, "control-panel");
            return this._controlPanel = widget.widgetResource;
        }
        return this._controlPanel;
    }

    get profile(){
        return this._profile;
    }

    get backEndGallery(){
        return this._gallery.get("backend");
    }

    get publisherGallery(){
        return this._gallery.get("publisher");
    }

    get controlPanel(){
        return this._controlPanel;
    }
}