let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine = Engine.create(),
    world = engine.world;

let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false
    }
});

Render.run(render);

let runner = Runner.create();
Runner.run(runner, engine);

let ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true });

let rockOptions = { density: 0.01 };
let rock = Bodies.circle(170, 450, 20, rockOptions);

let anchor = { x: 170, y: 450 };
let elastic = Constraint.create({ 
    pointA: anchor, 
    bodyB: rock, 
    stiffness: 0.2
});

function createTower(x, y) {
    if(y == 395) return Bodies.circle(x, y, 25, {
            density: 0.002,
            friction: .6,
            render: {
                fillStyle: 'green',
                strokeStyle: 'black',
                lineWidth: 5
            }
        });
    else return Bodies.rectangle(x, y, 50, 50, {
        density: 0.002,
        friction: .6,
        render: {
            fillStyle: 'gray',
            strokeStyle: 'darkgray',
            lineWidth: 5
        }
    });
}

let tower = Composites.stack(400, 395, 5, 4, 0, 0, createTower);

World.add(engine.world, [ground, rock, elastic, tower]);

Events.on(engine, 'afterUpdate', function() {
    if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
        rock = Bodies.circle(170, 450, 20, rockOptions);
        World.add(engine.world, rock);
        elastic.bodyB = rock;
    }
});

let mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

World.add(world, mouseConstraint);

render.mouse = mouse;

Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});
