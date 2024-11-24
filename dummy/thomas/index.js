
import DocEngine from "../../js/doc/DocEngine.js"
import SlateMap from "../../js/data/SlateMap.js";
import ComputerInfo from "../../js/data/thomas/ComputerInfo.js";

document.addEventListener("DOMContentLoaded", (ev)=>{

    const docEngine = DocEngine.instance;
    const slateMap = {...SlateMap };
    slateMap["main-id"] = "thomas";
    slateMap["sub-id"] = "dummy";

    slateMap["computers"] = getInofs();
    docEngine.run(slateMap);

});


function getInofs(){
    let infos = [];

    const names = [
        "A Computer", 
        "B Computer", 
        "C Computer", 
        "MY Computer",   "D Computer"
    ];
    const urls = [
        "172.30.1.23", 
        "172.30.1.3", 
        "172.30.1.40", 
        "172.30.1.18",  "172.30.1.6",
    ];
    const position = [
        [2, 1], 
        [3, 2],
        [0, 3],
        [0, 4],     [3,4]
    ];

    for(let i = 0; i < names.length; ++i){
        infos.push( new ComputerInfo().set(names[i], urls[i], position[i]) );
    }
    return infos;
}