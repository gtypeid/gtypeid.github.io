
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";

export default class Monitor extends WidgetResource{
    constructor(cwrd){
        super(cwrd);  
        this._generator; 
        this._iconWidgets = new Map();
    }

    rConstructor(){
        super.rConstructor();
        this._generator = this.addComp(EntityGenerator);
        this._generator.makeElements("container", "monitor-icon", this.getICons() );
    }

    getICons(){
        let icons = [];
        icons.push( {
            src : "icon-computer.png",
            widget : "computer-spawner",
        });

        icons.push( {
            src : "icon-train.png",
            widget : "train-factory",
        });

        return icons;
    }


    iconClick(icon, item){
        this.generateIconWidget(item);
    }

    async generateIconWidget(item){
        const htmlPipeLine = DocEngine.instance.htmlPipeLine;
        const key = item.widget;
        const hasKey = this._iconWidgets.has(key);

        if(!hasKey){
            const widget = await htmlPipeLine.asyncRunTimeSpawnWidget(document.body, key);
            const wr = widget.widgetResource;
            this._iconWidgets.set(key, wr)
        }

        const wr = this._iconWidgets.get(key);
        wr.visible = true;
    }
    
    getIconWidgets(widgetKey){
        return this._iconWidgets.get(widgetKey);
    }

    get computerSpawner(){
        return this._iconWidgets.get("computer-spawner");
    }

    get trainFactory(){
        return this._iconWidgets.get("train-factory");
    }


}