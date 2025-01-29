const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext('2d');

const gravity = 1;

const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: 'blue',
    dx: 0,
    dy: 0,
    face: 'right',
    speed: 12,
    walkSpeed: 5,
    jumpForce: -26,
    isAirborne: false,
    jumpIsRelease: true,
    attacking: false,
    canAttack: true,
    activeAttackHitbox: false,
    currentAttackTimer: 0,
    maxAttackTimer: 15,
    firstActiveAttackHitbox: 3,
    lastActiveAttackHitbox: 5,
    cameraY: 0,                 //init when the game start line 172
    cameraYWanted: 0,
    cameraSpeed: 0,
};

/**
 * 
 * 
 * Important: First put none object for the background or elevator objects so that they have priority over collisions.
 * Then put the other types of object.
 */
const structs = [
    { x: -150, y: 0, width: 100, height: 400, color: '#694b37', type: 'none' },                                 //tree (yes, it's a tree, or it will be)
    { x: -150, y: 350, width: 100, height: 20, color: 'brown', type: 'elevator', baseY:350, maxY:0, speed:-5 }, //elevator
    { x: -200, y: 0, width: 50, height: 400, color: '#00000000', type: 'bloc' },                                //invisible wall
    { x: -150, y: 350, width: 800, height: 50, color: 'green', type: 'bloc' },                                  //main floor
    { x: 200, y: 250, width: 100, height: 20, color: 'brown', type: 'plat' },                                   //platform test
    { x: 400, y: 200, width: 150, height: 20, color: 'brown', type: 'plat' },                                   //platform test
    { x: 400, y: 320, width: 30, height: 30, color: 'purple', type: 'button', active: false, text: 'Luca de Brito', textColor: '#ffffff', textBorderColor: '#000000' },
];

const keys = { left: false, right: false, jump: false, walk: false, attack: false };

document.addEventListener("keydown", (e) => {
    if (e.key === "q" || e.key === "Q")
    {
        keys.left = true;
    }
    if (e.key === "d" || e.key === "D")
    {
        keys.right = true;
    }
    if (e.key === " ")
    {
        keys.jump = true;
    }
    if (e.key === "Shift")
    {
        keys.walk = true;
    }
    if (e.key === "l" || e.key === "l")
    {
        keys.attack = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "q" || e.key === "Q")
    {
        keys.left = false;
    }
    if (e.key === "d" || e.key === "D")
    {
        keys.right = false;
    }
    if (e.key === " ")
    {
        player.jumpIsRelease = true;
        keys.jump = false;
    }
    if (e.key === "Shift")
    {
        keys.walk = false;
    }
    if (e.key === "l" || e.key === "l")
    {
        player.canAttack = true;
        keys.attack = false;
    }
});

window.addEventListener("resize", resizeCanvas);

function updateGame()
{
    speed = player.speed;
    if (keys.walk)
    {
        speed = player.walkSpeed;
    }

    if (keys.attack && !player.attacking
    && player.canAttack)
    {
        player.canAttack = false;
        player.attacking = true;
    }

    if (player.attacking)
    {
        if (player.currentAttackTimer <= player.maxAttackTimer)
        {
            currentAttackTime++;
            
            if (player.currentAttackTime >= player.firstActiveAttackHitbox && player.currentAttackTime <= player.lastActiveAttackHitbox)
            {
                console.log('attack');
                activeAttackHitbox = true;
            }
            else
            {
                activeAttackHitbox = false;
            }
        }
        else
        {
            player.currentAttackTimer = 0;
            player.attacking = false;
        }
    }

    if (keys.left && !keys.right)
    {
        if (!activeAttackHitbox)
        {
            player.face = 'left';
        }
        player.dx = -speed;
    }
    else if (keys.right && !keys.left)
    {
        if (!activeAttackHitbox)
        {
            player.face = 'right';
        }
        player.dx = speed;
    }
    else
    {
        player.dx = 0;
    }

    if (keys.jump && !player.isAirborne 
    && player.jumpIsRelease)
    {
        player.jumpIsRelease = false;
        player.dy = player.jumpForce;
        player.isAirborne = true;
    }

    if (!keys.jump && player.jumpIsRelease 
    && player.dy < 0 )
    {
        player.dy = 0;
    }

    if ((player.cameraY < player.cameraYWanted && player.cameraSpeed > 0) 
    || (player.cameraY > player.cameraYWanted && player.cameraSpeed < 0))
    {
        player.cameraY += player.cameraSpeed;
        player.cameraSpeed = (player.cameraYWanted - player.cameraY) / 20;
    }

    player.dy += gravity;

    player.isAirborne = true;

    console.log(player.cameraY);

    structs.forEach((struct) => {
        //if player landing
        if ((struct.type == 'plat' || struct.type == 'bloc' 
        || struct.type == 'elevator') && player.x < struct.x + struct.width 
        && player.x + player.width > struct.x && player.y + player.height <= struct.y 
        && player.y + player.height + player.dy > struct.y)
        {
            player.isAirborne = false;
            player.dy = 0;
            player.y = struct.y - player.height;
            player.cameraYWanted = canvas.height - 330 - player.y;
            player.cameraSpeed = (player.cameraYWanted - player.cameraY) / 20;
        }

        //if player is on an elevator
        if (struct.type == 'elevator' && player.x < struct.x + struct.width 
        && player.x + player.width > struct.x && player.y + player.height == struct.y
        && struct.y != struct.maxY) 
        {
            struct.y += struct.speed;
            player.y = struct.y - player.height;
        }
        else if (struct.type == 'elevator' && !(player.x < struct.x + struct.width 
        && player.x + player.width > struct.x && player.y + player.height == struct.y) 
        && struct.y != struct.baseY)
        {
            struct.y -= struct.speed;
        }

        //if player pushing wall from the right
        if ((struct.type == 'bloc' || struct.type == 'elevator') 
        && player.x >= struct.x + struct.width && player.x + player.dx < struct.x + struct.width 
        && player.y < struct.y + struct.height && player.y + player.height > struct.y)
        {
            player.dx = 0;
            player.x = struct.x + struct.width;
        }

        //if player pushing wall from the left
        if ((struct.type == 'bloc' || struct.type == 'elevator') 
        && player.x + player.width <= struct.x && player.x + player.width + player.dx > struct.x 
        && player.y < struct.y + struct.height && player.y + player.height > struct.y)
        {
            player.dx = 0;
            player.x = struct.x - player.width;
        }

        //if player headbonking roof (idfk man)
        if ((struct.type == 'bloc' || struct.type == 'elevator') 
        && player.x < struct.x + struct.width && player.x + player.width > struct.x 
        && player.y > struct.y + struct.height && player.y + player.dy <= struct.y + struct.height)
        {
            player.dy = 0;
            player.y = struct.y + struct.height;
        }
    });

    player.y += player.dy;
    player.x += player.dx;
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elevators = [];

    structs.forEach((struct) => {
        if (struct.type != 'elevator')
        {
            ctx.fillStyle = struct.color;
            ctx.fillRect(struct.x - player.x + (canvas.width - player.width) / 2, struct.y + player.cameraY, struct.width, struct.height);

            if (struct.type == 'button' && struct.active == false)
            {
                ctx.font = "48px serif";
                ctx.fillStyle = struct.textColor;
                ctx.textAlign = "center";

                const textX = struct.x - player.x + (canvas.width - player.width + struct.width) / 2;
                const textY = struct.y - 80 + player.cameraY;

                ctx.strokeStyle = struct.textBorderColor;
                ctx.lineWidth = 4;
                ctx.strokeText(struct.text, textX, textY);

                ctx.fillText(struct.text, textX, textY);
            }
        }
        else
        {
            elevators.push(struct);
        }
    });

    elevators.forEach((elevator) => {
        ctx.fillStyle = elevator.color;
        ctx.fillRect(elevator.x - player.x + (canvas.width - player.width) / 2, elevator.y + player.cameraY, elevator.width, elevator.height);
    });

    ctx.fillStyle = player.color;
    ctx.fillRect((canvas.width - player.width) / 2, player.cameraY + player.y, player.width, player.height);
}

function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.cameraY = canvas.height - 330 - player.y;
    player.cameraYWanted = canvas.height - 330 - player.y;
}

function gameLoop()
{
    updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

resizeCanvas();

gameLoop();