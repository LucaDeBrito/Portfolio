const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const gravity = 1;
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: 'blue',
    dx: 0,
    dy: 0,
    speed: 12,
    walkSpeed: 5,
    jumpForce: -26,
    isAirborne: false,
    jumpIsRelease: true
};

const structs = [
    { x: -200, y: 0, width: 50, height: 400, color: 'green', type: 'bloc' },
    { x: -150, y: 0, width: 100, height: 400, color: 'brown', type: 'none' },
    { x: -150, y: 350, width: 800, height: 50, color: 'green', type: 'bloc' },
    { x: 200, y: 250, width: 100, height: 20, color: 'brown', type: 'plat' },
    { x: 400, y: 200, width: 150, height: 20, color: 'brown', type: 'plat' }
];

const keys = { left: false, right: false, jump: false, walk: false };

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
});

function updatePlayer()
{
    speed = player.speed;
    if (keys.walk)
    {
        speed = player.walkSpeed;
    }

    if (keys.left && !keys.right)
    {
        player.dx = -speed;
    }
    else if (keys.right && !keys.left)
    {
        player.dx = speed;
    }
    else
    {
        player.dx = 0;
    }

    if (keys.jump && !player.isAirborne && player.jumpIsRelease)
    {
        player.jumpIsRelease = false;
        player.dy = player.jumpForce;
        player.isAirborne = true;
    }

    if (!keys.jump && player.jumpIsRelease && player.dy < 0 )
    {
        player.dy = 0;
    }

    player.dy += gravity;

    player.x += player.dx;
    player.y += player.dy;

    player.isAirborne = true;
    structs.forEach((struct) => {
        if (player.x < struct.x + struct.width && player.x + player.width > struct.x 
        && player.y + player.height > struct.y && player.y + player.height - player.dy <= struct.y
        && (struct.type == 'plat' || struct.type == 'bloc'))
        {
            player.isAirborne = false;
            player.dy = 0;
            player.y = struct.y - player.height;
        }

        /*if (player.x < struct.x + struct.width && player.x + player.width > struct.x 
        && player.y + player.height > struct.y && player.y + player.height - player.dy <= struct.y
        && (struct.type == 'plat' || struct.type == 'bloc'))
        {
            player.dx = 0;
            player.y = struct.y - player.height;
        }*/
    });

    if (player.y + player.height > canvas.height)
    {
        player.y = canvas.height - player.height;
        player.isAirborne = false;
        player.dy = 0;
    }
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    structs.forEach((struct) => {
        ctx.fillStyle = struct.color;
        ctx.fillRect(struct.x - player.x + 375, struct.y, struct.width, struct.height);
    });

    ctx.fillStyle = player.color;
    ctx.fillRect(375, player.y, player.width, player.height);
}

function gameLoop()
{
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();