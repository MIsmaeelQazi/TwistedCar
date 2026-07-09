const Canvas = document.getElementById("gameCanvas");
const Ctx = Canvas.getContext("2d");

let CurrentState = "Menu";
let Keys = {};
let IsInverted = false;
let Score = 0;
let Frames = 0; 

const playerImg = new Image();
playerImg.src = "your-player-car.png";

const roadImg = new Image();
roadImg.src = "your-road.png";


let Player = {
    X: 0, 
    Y: 500, 
    Width: 50,
    Height: 80,
    Speed: 5
};


let Enemies = [];

const EnemyColors = ["red", "blue", "green", "yellow", "purple", "orange"];


window.addEventListener("keydown", (Event) => Keys[Event.key] = true);
window.addEventListener("keyup", (Event) => Keys[Event.key] = false);

setInterval(() => {
    if(CurrentState === "Playing") {
        IsInverted = !IsInverted;
    }
}, 6000);



function ResetGame() {
    Enemies = [];
    Score = 0;
    Frames = 0;
    IsInverted = false;
    Player.X = (Canvas.width / 2) - (Player.Width / 2);
}

function SpawnEnemy() {
    const LaneWidth = Canvas.width / 3;
    

    const RandomLane = Math.floor(Math.random() * 3);

    const EnemyX = (RandomLane * LaneWidth) + (LaneWidth / 2) - (Player.Width / 2);

    const RandomColor = EnemyColors[Math.floor(Math.random() * EnemyColors.length)];

    Enemies.push({
        X: EnemyX,
        Y: -100, 
        Width: 50,
        Height: 80,
        Speed: 3 + Math.random() * 3, 
        Color: RandomColor
    });
}

function UpdateGame() {
    if (!IsInverted) {
        if (Keys["ArrowLeft"] || Keys["a"]) Player.X -= Player.Speed;
        if (Keys["ArrowRight"] || Keys["d"]) Player.X += Player.Speed;
    } else {
        if (Keys["ArrowLeft"] || Keys["a"]) Player.X += Player.Speed;
        if (Keys["ArrowRight"] || Keys["d"]) Player.X -= Player.Speed;
    }

    if (Player.X < 0) Player.X = 0;
    if (Player.X + Player.Width > Canvas.width) Player.X = Canvas.width - Player.Width;

    Frames++;
    if (Frames % 80 === 0) { 
        SpawnEnemy();
    }

    for (let i = Enemies.length - 1; i >= 0; i--) {
        let Enemy = Enemies[i];
        Enemy.Y += Enemy.Speed;
        if (Enemy.Y > Canvas.height) {
            Enemies.splice(i, 1);
            Score++;
            continue;
        }

        if (
            Player.X < Enemy.X + Enemy.Width &&
            Player.X + Player.Width > Enemy.X &&
            Player.Y < Enemy.Y + Enemy.Height &&
            Player.Y + Player.Height > Enemy.Y
        ) {
            CurrentState = "Menu"; 
        }
    }
}

function DrawMenu() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height);

    Ctx.fillStyle = "white";
    Ctx.font = "40px monospace";
    Ctx.textAlign = "center";
    Ctx.fillText("Retro Racer", Canvas.width/2, Canvas.height/2 - 50);

    Ctx.font = "20px monospace";
    Ctx.fillText("Press Enter to Start", Canvas.width/2, Canvas.height/2 + 20);
    Ctx.fillText("Press H for how to play", Canvas.width/2, Canvas.height/2 + 60);
    Ctx.fillText("Press C for credits", Canvas.width/2, Canvas.height/2 + 100);

    if (Keys["Enter"]) {
        ResetGame();
        CurrentState = "Playing";
    }
    if (Keys["h"] || Keys["H"]) CurrentState = "HowToPlay";
    if (Keys["c"] || Keys["C"]) CurrentState = "Credits";
}

function DrawHowToPlay() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height);
    Ctx.fillStyle = "white";
    Ctx.fillText("How to Play", Canvas.width/2, 200);
    Ctx.fillText("Dodge cars. Steering breaks every 6s!", Canvas.width/2, 250);
    Ctx.fillText("[ Press ESC to go back ]", Canvas.width/2, 350);

    if (Keys["Escape"]) CurrentState = "Menu";
}

function DrawCredits() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height);
    Ctx.fillStyle = "white";
    Ctx.fillText("Credits Screen", Canvas.width/2, 200);
    Ctx.fillText("[ Press ESC to go back ]", Canvas.width/2, 350); 
    if (Keys["Escape"]) CurrentState = "Menu";
}

function DrawGame() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height);
    
    Ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    Ctx.setLineDash([20, 20]);
    Ctx.beginPath();
    Ctx.moveTo(Canvas.width / 3, 0);
    Ctx.lineTo(Canvas.width / 3, Canvas.height);
    Ctx.moveTo((Canvas.width / 3) * 2, 0);
    Ctx.lineTo((Canvas.width / 3) * 2, Canvas.height);
    Ctx.stroke();
    Ctx.setLineDash([]); 

    for (let i = 0; i < Enemies.length; i++) {
        let Enemy = Enemies[i];
        Ctx.fillStyle = Enemy.Color;
        Ctx.fillRect(Enemy.X, Enemy.Y, Enemy.Width, Enemy.Height);
        
    }

    Ctx.fillStyle = "white"; 
    Ctx.fillRect(Player.X, Player.Y, Player.Width, Player.Height);

    Ctx.fillStyle = "white";
    Ctx.font = "20px monospace";
    Ctx.textAlign = "left";
    Ctx.fillText("Score: " + Score, 10, 30);

    if(IsInverted){
        Ctx.fillStyle = "red";
        Ctx.font = "24px monospace";
        Ctx.textAlign = "center";
        Ctx.fillText("Warning: STEERING BROKEN!!!", Canvas.width/2, Canvas.height/2);
    }
}
function MainLoop(){
    if(CurrentState === "Menu") {
        DrawMenu();
    } else if(CurrentState === "HowToPlay") {
        DrawHowToPlay();
    } else if(CurrentState === "Credits") {
        DrawCredits();
    } else if(CurrentState === "Playing") {
        UpdateGame();
        DrawGame();
    }
    requestAnimationFrame(MainLoop);
}

MainLoop();