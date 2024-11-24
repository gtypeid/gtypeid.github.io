// import CommonThomas from "./thomas/CommonThomas.js";
import CommonFolio from "./folio/CommonFolio.js";

const SlateMap = {
    "main-id" : "",
    "sub-id" : "",
    "resource-path" : "/resource",
    "widget-replace" : true,
    "mobile" : 376,
    "tablet" : 576,
    "end-point" : "",
    "computers" : "",

    getCommon : ()=>{
        const common = new CommonFolio();
        return common;
    }
};

export default SlateMap;