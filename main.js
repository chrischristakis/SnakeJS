const canvas = document.getElementById("c");
const cw = canvas.width = 550;
const ch = canvas.height = 550;
const ctx = canvas.getContext("2d");
const gridDim = 18;
const cellW = cw/gridDim;
const cellH = ch/gridDim;
const Direction = {  // Offsets for our grid indexes
    LEFT: [0,-1],
    RIGHT: [0, 1],
    UP: [-1, 0],
    DOWN: [1, 0]
};
const tps = 15;

let snakeLen;
let gameover = false;
let snake;  // Hold a list of row,col indexes of each snake cell
let grid;
let dir;
let nextDir;

init();

function init() {
    grid = createGrid(gridDim);

    const startX = Math.floor(gridDim / 2);
    const startY = 0;

    grid[startY][startX] = 1;
    snake = [[startY,startX]];
    snakeLen = 5;
    nextDir = Direction.DOWN;
    spawnFruit();

    gameover = false;
}

function rint(min, max) {
    return Math.random() * (max - min) + min;
}

function createGrid(gridDim) {
    let grid = [];
    for(let row = 0; row < gridDim; row++) {
        grid.push([]);
        for(let col = 0; col < gridDim; col++) {
            grid[row].push(0);
        }
    }
    return grid;
}

function spawnFruit() {
    let potentialSpots = [];
    for(let row = 0; row < gridDim; row++) {
        for(let col = 0; col < gridDim; col++) {
            if(grid[row][col] == 0)
                potentialSpots.push([row,col]);
        }
    }
    if(potentialSpots.length == 0) 
        return console.log("Wow, that's impressive. Well done :)");

    const [r, c] = potentialSpots[Math.round(rint(0, potentialSpots.length))];
    grid[r][c] = 2;
}

function update() {
    let intervalID = setInterval(() => {
        if(!gameover) {
            const [headR, headC] = snake[snake.length-1];
            const [offR, offC] = nextDir;
            dir = nextDir;
            let nextR = headR + offR;
            let nextC = headC + offC;

            // Bounds
            if(nextR < 0) nextR = gridDim-1;
            if(nextR > gridDim-1) nextR = 0;
            if(nextC < 0) nextC = gridDim-1;
            if(nextC > gridDim-1) nextC = 0;

            if(grid[nextR][nextC] == 1)
                gameover = true;
            if(grid[nextR][nextC] == 2) {
                snakeLen++;
                spawnFruit();
            }

            grid[nextR][nextC] = 1;

            snake.push([nextR, nextC]);
            if(snake.length > snakeLen) {
                const [popR, popC] = snake.shift();
                grid[popR][popC] = 0;
            }
        }
    }, 1000/tps);
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,cw,ch);
    for(let row = 0; row < gridDim; row++) {
        for(let col = 0; col < gridDim; col++) {
            if(grid[row][col] == 1) {
                ctx.fillStyle="#E07A5F";
                ctx.fillRect(col*cellW + 3, row*cellH + 3, cellW - 6, cellH - 6);
            }
            if(grid[row][col] == 2) {
                ctx.fillStyle="#F2CC8F";
                ctx.fillRect(col*cellW + 3, row*cellH + 3, cellW - 6, cellH - 6);
            }
        }
    }

    if(gameover) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0,0,cw,ch);
        ctx.fillStyle = '#faa';
        ctx.font = '35px noto-sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("Game over! Press space to try again", cw/2, ch/2);
    }
}

//--INPUT--//
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w':
            if(dir !== Direction.DOWN)
                nextDir = Direction.UP;
            break;
        case 's':
            if(dir !== Direction.UP)
                nextDir = Direction.DOWN;
            break;
        case 'a':
            if(dir !== Direction.RIGHT)
                nextDir = Direction.LEFT;
            break;
        case 'd':
            if(dir !== Direction.LEFT)
               nextDir = Direction.RIGHT;
            break;
        case ' ':
            if(gameover) 
                init();
            break;
    }
});
//---------//

update();
draw();