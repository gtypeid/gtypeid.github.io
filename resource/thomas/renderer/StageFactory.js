import MatterEngine from "./MatterEngine.js";
import * as Util from "../../../js/doc/Util.js";

export default class StageFactory{
    
    constructor(renderer, matterEngine){
        this._renderer = renderer;
        this._matterEngine = matterEngine;
        
        this._plan;
        this._originPlanPosition;

        this._endWorld;
        this.inIt();
    }

    inIt(){
        this._plan = this.createPlan();
        this._originPlanPosition = {...this._plan.position};
        this._endWorld = this.createEndWorld();
        this.createBanner();
        this.createBannerSmallBox();
    }

    spawnBlaster(inX, inY, dir, power){
        const offeset = 75;
        const x = inX + (dir.x * offeset);
        const y = inY + (dir.y * offeset);

        const blaster = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE,[x, y, 20, 10],
            {
                render: {
                    sprite: {
                        texture: "/resource/path/laser1.png",
                        xScale: 1.0,
                        yScale: 0.5,
                    },
                },
            }
         );
        const vel = {
            x : dir.x * power,
            y : dir.y * power
        };

        this._matterEngine.addForce(blaster, dir, vel);
    }

    spawnTrain(item){
        const randX = Util.getMinMaxRandomInt(100, 1200);
        const randY = Util.getMinMaxRandomInt(200, 350);
        const context = {
            x : randX,
            y : randY,
            sizeX : 100,
            sizeY : 100,
            scaleX : 0.30,
            scaleY : 0.30,
        }
        this._matterEngine.multiCreate( (matters)=>{
            const { x, y, sizeX, sizeY, scaleX, scaleY } = context;

            const {Constraint} = matters;
            const moveBox = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE,
                [x, 15, 50, 20],
                {
                    label : "movebox",
                    isStatic: true,
                }, false ); 
                
            const train = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE,
                [x, y, sizeX, sizeY],
                {
                    render: {
                        sprite: {
                            texture: "/resource/path/" + item.icon,
                            xScale: scaleX,
                            yScale: scaleY,
                        },
                    },
                }, false ); 
            
            const renderOption = {
                strokeStyle: 'gray',
                lineWidth: 0.5
            };

            const constraint0 = Constraint.create({
                bodyA: moveBox,
                pointA: { x: 0, y: 5 },
                bodyB: train,
                pointB: { x: 0, y: -25 },
                stiffness: 0.0005,
                damping: 0.0001,
                render : renderOption
            });
    

            return [moveBox, train, constraint0];
        });

    }

    shakeObject(object, options){
        const { randX, randY, time, rate } = options;
        //this._matterEngine.changePosition(object, this._originPlanPosition.x, this._originPlanPosition.y);
        const {x, y} = object.position;
    

        const intervalId = setInterval(() => {
            const positionX = Util.getMinMaxRandomInt(-randX, randX);
            const positionY = Util.getMinMaxRandomInt(-randY, randY);
            
            const calcX = x + positionX;
            const calcY = y + positionY;

            this._matterEngine.changePosition(object, calcX, calcY);
          }, rate);

        setTimeout(() => {
            clearInterval(intervalId);
            this._matterEngine.changePosition(object, this._originPlanPosition.x, this._originPlanPosition.y);
        }, time); 
    }

    createPlan(){
        const options = this._renderer.matterCanvasOptions;
        const {width, height} = options;

        const planHeight = 50;
        const planConstituent = [(width / 2), (height - ( planHeight) ), width, planHeight];
        const item = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE, planConstituent, {
             isStatic: true,
             render : {
                fillStyle: 'black'
             }
            });
        return item;
    }

    createEndWorld(){
        const options = this._renderer.matterCanvasOptions;
        const {width, height} = options;

        const planConstituent = [(width / 2), height + 500, (width * 5), 500];
        const item = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE, planConstituent, {
             isStatic: true
            });

        return item;
    }
    
    createBanner(){
        this._matterEngine.multiCreate( (matters)=>{
            const {Constraint} = matters;
            const boxA = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE,
                [20, 20, 225, 80],
                {
                    render: {
                        sprite: {
                            texture: "/resource/path/thomas-logo.png",
                            xScale: 0.45,
                            yScale: 0.45,
                        },
                    },
                }, false);
            
            const renderOption = {
                strokeStyle: '#ff0000',
                lineWidth: 4
            };

            const constraint0 = Constraint.create({
                pointA: { x: 50, y: 5 },
                bodyB: boxA,
                pointB: { x: -100, y: -65 },
                stiffness: 0.02,
                damping: 0.1,
                render : renderOption
            });
    
            const constraint1 = Constraint.create({
                pointA: { x: 250, y: 5 },
                bodyB: boxA,
                pointB: { x: 100, y: -65 },
                stiffness: 0.02,
                damping: 0.1,
                render : renderOption
            });

            return [boxA, constraint0, constraint1];
        });
    }

    createBannerSmallBox(){
        const rate = 10;
        const claerTime = 1700;
        const size = 12;
        const startX = 50;
        const mX = 225;
        const mY = 10;

        const intervalId = setInterval(() => {
            const randX = startX + Util.getRandomInt(mX);
            const randY = Util.getRandomInt(mY);
            const item = this._matterEngine.createPolygon(MatterEngine.Polygon.RECTANGLE, 
                [randX, randY, size, size]
            );

          }, rate);

        setTimeout(() => {
            clearInterval(intervalId);
        }, claerTime); // 2000 milliseconds = 2 seconds
    }


    get endWorld(){
        return this._endWorld;
    }

    get plan(){
        return this._plan;
    }


}