
import DocEngine from "../doc/DocEngine.js";
import Component from "./Component.js";
import HTTP from "../doc/HTTP.js";
import * as Util from "../doc/Util.js";


export default class HighlightSubtitle extends Component{
    constructor(parent){
        super(parent);
        this._contentElement;
        this._viewElement;
        this._viewTag;
    }
    
    bindHighlight(contentElement, viewElement){
        const wr = this.parent;
        this._contentElement = wr.findElements(contentElement)[0];
        this._viewElement = wr.findElements(viewElement)[0];
        this._viewTag = this.spawnViewTag();
        const h1Tags = this.spawnContentsTag("h1", "large");
        const h2Tags = this.spawnContentsTag("h2", "medium");
        const h3Tags = this.spawnContentsTag("h3", "small");
        this.sortByTag(h2Tags, h1Tags, "h2", "h1", "10px");
        this.sortByTag(h3Tags, h2Tags, "h3", "h2", "20px");

        for(let it of this._contentElement.children){
            const localName = it.localName;

            if(localName === "h1"){
                it.style.marginTop = "125px";
                if(it.getAttribute("t-index") === "0")
                    it.style.marginTop = "50px";
            }
            if(localName === "h2"){
                it.style.marginLeft = "40px";
            }

            if(localName === "h3"){
                it.style.marginLeft = "75px";
            }

            if(localName === "p" || localName === "div" || localName === "pre"){
                it.style.marginLeft = "85px";
                if(localName === "pre"){
                    it.style.fontSize = "initial";
                }
            }

        }
        
        this.highlight();
        wr.findElements("top")[0].addEventListener('scroll', ()=> {
            this.highlight();
        });
    }

    highlight(){
        const hTags = document.querySelectorAll('h1, h2, h3');
        hTags.forEach((it) => {
            const rect = it.getBoundingClientRect();
            it.style.color = "black";
            if (rect.top <= 250 && rect.bottom > 0) {
                it.style.color = "green";
                const tIndex = it.getAttribute("t-index");
            }
        });
    }

    spawnContentsTag(tag, size){
        const elements = this._contentElement.querySelectorAll(tag);
        const tagList = new Array();
        for(let i = 0; i < elements.length; ++i){

            elements[i].setAttribute("t-index", i);

            const p = document.createElement("p");
            p.innerHTML = elements[i].innerHTML;
            this._viewTag.appendChild(p);
            p.setAttribute("t-index", i);
            p.setAttribute("t-type", tag);

            p.style.fontSize = size;
            p.style.cursor = "pointer";
            p.addEventListener("mouseover", (event)=> {
                event.stopPropagation();
                p.style.backgroundColor = "rgba(255, 255, 0, 0.5)"; 
            });
            
            p.addEventListener("mouseout", (event)=> {
                event.stopPropagation();
                p.style.backgroundColor = ""; 
            });

            p.addEventListener("click", (event)=> {
                event.stopPropagation();
                this.tagClick(event.target);
            });

            tagList.push(p);
        }
        return tagList;
    }

    tagClick(target){
        const content = this._contentElement;
        const tag = target.getAttribute("t-type");
        const index = target.getAttribute("t-index");
        const tags = content.getElementsByTagName(tag);
        const element = tags[index];
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    sortByTag(selfTag, targetTag, selfElementType, targetElementType, margin){
        const elements = this._contentElement.querySelectorAll(selfElementType);
 
        for(let i = 0; i < elements.length; ++i){

            let previousTag = elements[i].previousElementSibling;
            while (previousTag) {
                if (previousTag.localName === targetElementType) { 
                    const tIndex = previousTag.getAttribute("t-index");
                    selfTag[i].style.marginLeft = margin;
                    targetTag[tIndex].appendChild(selfTag[i]);

                    //const nextElement = elements[i].nextElementSibling;
                    //this._viewTag.insertBefore(selfTag[i], targetTag[tIndex].nextElementSibling);
                    break;  
                }
                previousTag = previousTag.previousElementSibling;
            }
        }
    }

    spawnViewTag(ctx){
        let viewCtx = ctx;
        if(Util.isEmpty(ctx)){
            viewCtx = {
                position : "absolute",
                top : "0px",
                left : "0px",
                height : "100%",
                width : "200px",
                overflowX : "hidden",
                zIndex : 1
            }
        }
        const viewTag = document.createElement("div");
        Object.entries(viewCtx).forEach(([key, value]) => {
            viewTag.style[key] = value;
        });

        viewTag.classList.add("highlight-view-tag");
        this._viewElement.appendChild(viewTag);

        return viewTag;
    }

    


}   


