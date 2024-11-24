import * as Util from "../../../js/doc/Util.js";

export default class MatterEngine{

    static Polygon = {
        RECTANGLE : "rectangle",
    }

    constructor(inItData){
        this._matters = {
            WorldEngine : null,
            WorldRender : null,

            Engine : Matter.Engine,
            Render : Matter.Render,
            Runner : Matter.Runner,
            Bodies : Matter.Bodies,             // 도형 생성기
            Constraint : Matter.Constraint,     // 라인 연결 제한기 생성기
            Composite : Matter.Composite,       // 월드에 도형 정의기
            Mouse : Matter.Mouse,
            MouseConstraint : Matter.MouseConstraint,
            Events : Matter.Events,
            World : Matter.World,
            Body : Matter.Body,
        }
        
        this._renderer = inItData[0];
        this._canvas = inItData[1];
        this._options = inItData[2];
        this.inIt(this._options);
    }

    inIt(inOptions) {
        const { Engine, Render, Runner, Composite, Mouse, MouseConstraint, Events, Body } = this._matters;
        this._matters.WorldEngine = Engine.create();

        const worldEngine = this._matters.WorldEngine;
        const world = worldEngine.world;

        this._matters.WorldRender = Render.create({
            //element: document.body,
            canvas : this._canvas,
            engine: worldEngine,
            options : inOptions
        });

        const runner = Runner.create();
        

        const render = this._matters.WorldRender;

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(worldEngine, {
            mouse: mouse,
            constraint: {
                // allow bodies on mouse to rotate
                angularStiffness: 0,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(world, mouseConstraint);
        render.mouse = mouse;

        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: this._options.width, y: this._options.height }
        });


        Events.on(runner, "tick", event => {
            const body = mouseConstraint.body;
            if (body && body.isStatic && body.label === "movebox") {
                Body.setPosition(mouseConstraint.body, { x: mouse.position.x, y: 15 });
            }
        });

        // 콜리전 닿으면
        Events.on(worldEngine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            pairs.forEach( (pair) => {
                this.enterCollision(pair);
            });
        });

        Render.run(render);
        Runner.run(runner, worldEngine);
    }

    enterCollision(pair){
        const {World, WorldEngine} = this._matters;

        const endWorld = this._renderer.stageFactory.endWorld;
        if(endWorld === pair.bodyA){
            World.remove(WorldEngine.world, pair.bodyB);
        }
    }

    createPolygon(polygon, constituent, options = null, autoPush = true){
        const { Bodies, Composite, WorldEngine} = this._matters;
        const world = WorldEngine.world;

        let item = null;
        if(polygon === MatterEngine.Polygon.RECTANGLE){
            const x = constituent[0];
            const y = constituent[1];
            const width = constituent[2];
            const height = constituent[3];
            
            Util.isEmpty(options) ? 
                item = Bodies.rectangle(x, y, width, height) :
                item = Bodies.rectangle(x, y, width, height, options);
            
        }

        if(autoPush)
            Composite.add(world, item);
        
        return item;
    }

    multiCreate(cb){
        const { Composite, WorldEngine} = this._matters;
        const world = WorldEngine.world;
        const results = cb(this._matters);
        Composite.add(world, results);
    }

    setBackGroundColor(color){
        const { WorldRender } = this._matters;
        WorldRender.canvas.style.backgroundColor = color;
    }

    changePosition(object, x, y){
        const { Body } = this._matters;
        Body.setPosition(object, { x: x, y: y });
    }

    addForce(object, dir, vel){
        const { Body } = this._matters;
        const targetAngle = Math.atan2(dir.y, dir.x);
        Body.setAngle(object, targetAngle);
        Body.applyForce( object, {x: object.position.x, y: object.position.y}, {x: vel.x, y: vel.y} );

    }
}