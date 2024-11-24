
import DocEngine from "../../js/doc/DocEngine.js"
import SlateMap from "../../js/data/SlateMap.js";

document.addEventListener("DOMContentLoaded", (ev)=>{

    mermaid.startOnLoad = false;

    const docEngine = DocEngine.instance;
    const slateMap = {...SlateMap };
    slateMap["main-id"] = "folio";
    docEngine.run(slateMap);

    const styles = [
        "@keyframes reveal { 0% { transform: translateX(100%); } 100% { transform: translateX(0); } }",
        "@keyframes animate { 0% { opacity: 0; transform: rotate(45deg) translate(-20px, -20px); } 50% { opacity: 1; } 100% { opacity: 0; transform: rotate(45deg) translate(20px, 20px); } }",
        
        "@keyframes bubbleAnimation { 0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; } 100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; } }",
    ]
    for(let style of styles){
        document.styleSheets[0].insertRule(style);
    }

});