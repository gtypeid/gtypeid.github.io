
import DocEngine from "../../../js/doc/DocEngine.js";

export default class EyesController {
    constructor(eyesBox, faceContext){
        this._eyesBox = eyesBox;
        this._activeEyesType = 0;
        this._eyes = [];
        this._eyesContexts = [];
        this._prevMouse = {
            x : 0,
            y : 0
        }
        this._dir = {
            x : 0,
            y : 0
        }

        this._faceContext = faceContext;
        this.itIt();
    }

    itIt(){
        const {eyesPoint, eyesPadding} = this._faceContext;

        for(let i = 0; i < 2; ++i){
            const img = document.createElement("img");
            img.classList.add("face-eyes");
            this._eyesBox.appendChild(img);
            this._eyes.push(img);
        }
        this._eyesContexts = this.generateEyesContexts();

        this.changeEyes(0);
        this._eyesBox.style.top = eyesPoint +'px';
        this._eyes[0].style.left = (eyesPadding) + 'px';
        this._eyes[1].style.right = (eyesPadding) + 'px';
    }

    generateEyesContexts(){
        let eyes = [];
        eyes.push({
            src : "/resource/path/eyes0.png",
            size : 35,
            adjust : 0
        });
        eyes.push({
            src : "/resource/path/eyes1.png",
            size : 35,
            adjust : 0
        });
        eyes.push({
            src : "/resource/path/eyes2.png",
            size : 35,
            adjust : 0
        });
        eyes.push({
            src : "/resource/path/eyes3.png",
            size : 35,
            adjust : 100
        });
        eyes.push({
            src : "/resource/path/eyes4.png",
            size : 35,
            adjust : 50
        });
        eyes.push({
            src : "/resource/path/eyes5.png",
            size : 35,
            adjust : 100
        });
        return eyes;
    }

    changeEyes(eyesTypeIndex){
        const eyesContext = this._eyesContexts[eyesTypeIndex];
        const {size, adjust} = eyesContext;    
        const calcSize = size + adjust;

        this._eyes[0].src = eyesContext.src;
        this._eyes[1].src = eyesContext.src;    

        this._eyes[0].style.width = calcSize +'px';
        this._eyes[1].style.width = calcSize +'px';
        this._eyes[0].style.height = calcSize +'px';
        this._eyes[1].style.height = calcSize +'px'; 
        this.setEyesPosition(eyesContext, this._prevMouse.x, this._prevMouse.y);


        const common = DocEngine.instance.common;
        const renderer = common.renderer;
        const matterEngine = renderer.matterEngine;

        const plan = renderer.stageFactory.plan;
        plan.render.fillStyle = "gray";

        if( eyesTypeIndex === 2){
            matterEngine.setBackGroundColor("#403030");
        }
        else if( eyesTypeIndex === 3 ){
            matterEngine.setBackGroundColor("#0a0a0a");
            plan.render.fillStyle = "#810000";
        }
        else if( eyesTypeIndex === 4 ){
            matterEngine.setBackGroundColor("#b80f0f");
        }
        else if( eyesTypeIndex === 5 ){
            matterEngine.setBackGroundColor("#2a52a9");
        }
        else {
            matterEngine.setBackGroundColor("white");
        }
    }

    click(){
        const normalEyes = 5;
        ++this._activeEyesType;
        if(this._activeEyesType > normalEyes){
            this._activeEyesType = 0;
        }
        this.changeEyes(this._activeEyesType);
    }

    getPosition(index){
        const rect = this._eyes[index].getBoundingClientRect();
        const x = rect.left + (this._eyesContexts[this._activeEyesType].adjust / 2);
        const y = rect.top + (this._eyesContexts[this._activeEyesType].adjust) / 2;
        return {
            left : x,
            top : y
        };
    }

    mouseMove(event){
        
        const { width, height, left, top, eyesPoint, eyesMaxMove} = this._faceContext;
        const startX = (width / 2) + left;
        const startY = eyesPoint + top;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const vx = distance > 0 ? dx / distance : 0;
        const vy = distance > 0 ? dy / distance : 0;

        this._dir = {
            x : vx,
            y : vy
        }

        const moveLeft = eyesMaxMove * vx;
        const moveTop = eyesMaxMove * vy;

        this._prevMouse.x = moveLeft;
        this._prevMouse.y = moveTop;

        const eyesContext = this._eyesContexts[this._activeEyesType];
        this.setEyesPosition(eyesContext, moveLeft, moveTop)
    }

    setEyesPosition(eyesContext, moveLeft, moveTop){

        const { eyesPadding } = this._faceContext;
        const { adjust } = eyesContext;
        const calcAdust = (adjust == 0) ? 0 : (adjust * 0.5);

        this._eyes[0].style.left = ((eyesPadding - calcAdust) + moveLeft) + 'px';
        this._eyes[1].style.right = ((eyesPadding - calcAdust) + (moveLeft * -1) ) + 'px';

        this._eyes[0].style.top = (moveTop - calcAdust) + 'px';
        this._eyes[1].style.top = (moveTop - calcAdust) + 'px';
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    get dir(){
        return this._dir;
    }
}