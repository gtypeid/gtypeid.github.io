
import WidgetResource from "../../../js/doc/WidgetResource.js";
import HTMLPipeLine from "../../../js/doc/HTMLPipeLine.js";
import DocEngine from "../../../js/doc/DocEngine.js";
import EntityGenerator from "../../../js/comp/EntityGenerator.js";
import WindowPanel from "../../../js/comp/WindowPanel.js";
import DocEventHandler from "../../../js/comp/DocEventHandler.js";

export default class ComputerSpawner extends WidgetResource{
    constructor(cwrd){
        super(cwrd);   
        this._layout = {
            width : 4,
            height : 5,
            wSize : 85,
            hSize : 85
        };
        this._activeComputer;
        this._generator;
        this._eventHandler;
        this._windowPanel;
    }

    rConstructor(){
        super.rConstructor();

        this._windowPanel = this.addComp(WindowPanel);
        this._eventHandler = this.addComp(DocEventHandler);
        this._generator = this.addComp(EntityGenerator);
        const wp = this._windowPanel;
        const eh = this._eventHandler;

        wp.bindWindowPanel(eh);        

        const infos = DocEngine.instance.slateMap["computers"]; 
        this._generator.makeElements("container", "computer", infos);
    }

    setActiveComputer(computer){
        if(this._activeComputer){
            this._activeComputer.disible();
        }
        
        this._activeComputer = computer;
    }

    get layout(){
        return this._layout;
    }

    get windowPanel(){
        return this._windowPanel;
    }

    set visible(value){
        this._windowPanel.visible = value;
    }

    get activeComputer(){
        return this._activeComputer;
    }
}