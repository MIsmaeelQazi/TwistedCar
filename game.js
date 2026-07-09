const Canvas = document.getElementById("gameCanvas");
const Ctx = Canvas.getContext("2d");

let CurrentState = "Menu";
let Keys = {};
let IsInverted = false;
let Score = 0;
let Frames = 0;
let BestScore = 0;

let Player = {
    X: 0,
    Y: 500,
    Width: 80,  
    Height: 90, 
    Speed: 5
};

let Enemies = [];

const EnemyColors = ["red", "blue", "green", "yellow", "purple", "orange"];

let RoadStripes = [];
const StripeHeight = 40;
const StripeGap = 30;

let DashOffset = 0;

const RoadMargin = Canvas.width * 0.08;

const LaneCount = 4;
const LaneWidth = (Canvas.width - RoadMargin * 2) / LaneCount;

window.addEventListener("keydown", (Event) => Keys[Event.key] = true);
window.addEventListener("keyup", (Event) => Keys[Event.key] = false);

setInterval(() => {
    if (CurrentState === "Playing") {
        IsInverted = !IsInverted;
    }
}, 6000);

function ResetGame() {
    Enemies = [];
    Score = 0;
    Frames = 0;
    IsInverted = false;
    Player.X = (Canvas.width / 2) - (Player.Width / 2);

    RoadStripes = [];
    for (let y = -StripeHeight; y < Canvas.height + StripeHeight; y += (StripeHeight + StripeGap)) {
        RoadStripes.push(y);
    }
}

function SpawnEnemy() {
    const RandomLane = Math.floor(Math.random() * LaneCount); 

    const EnemyWidth = 80; 
    const EnemyX = RoadMargin + (RandomLane * LaneWidth) + (LaneWidth - EnemyWidth) / 2;

    const RandomColor = EnemyColors[Math.floor(Math.random() * EnemyColors.length)];

    Enemies.push({
        X: EnemyX,
        Y: -100,
        Width: EnemyWidth,
        Height: 90, 
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

    for (let i = 0; i < RoadStripes.length; i++) {
        RoadStripes[i] += 6;
        if (RoadStripes[i] > Canvas.height) {
            RoadStripes[i] -= (StripeHeight + StripeGap) * RoadStripes.length;
        }
    }

    DashOffset -= 6;

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
            if (Score > BestScore) BestScore = Score;
            CurrentState = "Menu";
        }
    }
}

function DrawMenu() {
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    Ctx.fillStyle = "white";
    Ctx.font = "40px monospace";
    Ctx.textAlign = "center";
    Ctx.fillText("Retro Racer", Canvas.width / 2, Canvas.height / 2 - 50);

    Ctx.font = "20px monospace";
    Ctx.fillText("Press Enter to Start", Canvas.width / 2, Canvas.height / 2 + 20);
    Ctx.fillText("Press H for how to play", Canvas.width / 2, Canvas.height / 2 + 60);

    Ctx.font = "18px monospace";
    Ctx.fillStyle = "yellow";
    Ctx.fillText("Best Score: " + BestScore, Canvas.width / 2, Canvas.height / 2 + 100);

    if (Keys["Enter"]) {
        ResetGame();
        CurrentState = "Playing";
    }
    if (Keys["h"] || Keys["H"]) CurrentState = "HowToPlay";
}

function DrawHowToPlay() {
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    Ctx.fillStyle = "white";
    Ctx.textAlign = "center";
    Ctx.font = "30px monospace";
    Ctx.fillText("How to Play", Canvas.width / 2, 200);
    Ctx.font = "18px monospace";
    Ctx.fillText("Dodge cars. Steering breaks every 6s!", Canvas.width / 2, 250);
    Ctx.fillText("[ Press ESC to go back ]", Canvas.width / 2, 350);

    if (Keys["Escape"]) CurrentState = "Menu";
}

function DrawRoad() {
    Ctx.fillStyle = "#2f5d34"; //grass
    Ctx.fillRect(0, 0, Canvas.width, Canvas.height);

    Ctx.fillStyle = "#3a3a3a"; //Asphalt
    Ctx.fillRect(RoadMargin, 0, Canvas.width - (RoadMargin * 2), Canvas.height);

    Ctx.strokeStyle = "white"; // road edges
    Ctx.lineWidth = 4;
    Ctx.beginPath();
    Ctx.moveTo(RoadMargin, 0);
    Ctx.lineTo(RoadMargin, Canvas.height);
    Ctx.moveTo(Canvas.width - RoadMargin, 0);
    Ctx.lineTo(Canvas.width - RoadMargin, Canvas.height);
    Ctx.stroke();

    Ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; //Lane divider
    Ctx.lineWidth = 2;
    Ctx.setLineDash([20, 20]);
    Ctx.lineDashOffset = DashOffset;
    Ctx.beginPath();
    for (let lane = 1; lane < LaneCount; lane++) {
        const LineX = RoadMargin + lane * LaneWidth;
        Ctx.moveTo(LineX, 0);
        Ctx.lineTo(LineX, Canvas.height);
    }
    Ctx.stroke();
    Ctx.setLineDash([]);

    Ctx.fillStyle = "rgba(255, 255, 255, 0.35)"; //Animation sort of
    for (let i = 0; i < RoadStripes.length; i++) {
        Ctx.fillRect(Canvas.width / 2 - 4, RoadStripes[i], 8, StripeHeight);
    }
}

//Never did i thought drawing a car would be this hard
function DrawCar(X, Y, Width, Height, Color) {
    // Wheels
    Ctx.fillStyle = "#111";
    const WheelW = Width * 0.18;
    const WheelH = Height * 0.22;
    Ctx.fillRect(X - WheelW * 0.3, Y + Height * 0.12, WheelW, WheelH);
    Ctx.fillRect(X + Width - WheelW * 0.7, Y + Height * 0.12, WheelW, WheelH);
    Ctx.fillRect(X - WheelW * 0.3, Y + Height * 0.66, WheelW, WheelH);
    Ctx.fillRect(X + Width - WheelW * 0.7, Y + Height * 0.66, WheelW, WheelH);

    // Body
    Ctx.fillStyle = Color;
    const Radius = Width * 0.2;
    Ctx.beginPath();
    Ctx.moveTo(X + Radius, Y);
    Ctx.lineTo(X + Width - Radius, Y);
    Ctx.quadraticCurveTo(X + Width, Y, X + Width, Y + Radius);
    Ctx.lineTo(X + Width, Y + Height - Radius);
    Ctx.quadraticCurveTo(X + Width, Y + Height, X + Width - Radius, Y + Height);
    Ctx.lineTo(X + Radius, Y + Height);
    Ctx.quadraticCurveTo(X, Y + Height, X, Y + Height - Radius);
    Ctx.lineTo(X, Y + Radius);
    Ctx.quadraticCurveTo(X, Y, X + Radius, Y);
    Ctx.closePath();
    Ctx.fill();

    // Windscreen ig
    Ctx.fillStyle = "rgba(180,220,255,0.85)";
    Ctx.fillRect(X + Width * 0.15, Y + Height * 0.12, Width * 0.7, Height * 0.22); 
    Ctx.fillRect(X + Width * 0.15, Y + Height * 0.66, Width * 0.7, Height * 0.22); 
function DrawScoreboard() {
    const PanelX = 10;
    const PanelY = 10;
    const PanelW = 170;
    const PanelH = 60;

    Ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    Ctx.beginPath();
    Ctx.fillRect(PanelX, PanelY, PanelW, PanelH);
    Ctx.fill();

    Ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    Ctx.lineWidth = 1;
    Ctx.stroke();

    Ctx.textAlign = "left";
    Ctx.fillStyle = "white";
    Ctx.font = "20px monospace";
    Ctx.fillText("Score: " + Score, PanelX + 12, PanelY + 25);

    Ctx.font = "14px monospace";
    Ctx.fillStyle = "yellow";
    Ctx.fillText("Best: " + Math.max(BestScore, Score), PanelX + 12, PanelY + 46);
}

function DrawGame() {
    DrawRoad();

    for (let i = 0; i < Enemies.length; i++) {
        let Enemy = Enemies[i];
        DrawCar(Enemy.X, Enemy.Y, Enemy.Width, Enemy.Height, Enemy.Color);
    }

    DrawCar(Player.X, Player.Y, Player.Width, Player.Height, "white");

    DrawScoreboard();

    if (IsInverted) {
        Ctx.fillStyle = "red";
        Ctx.font = "24px monospace";
        Ctx.textAlign = "center";
        Ctx.fillText("Warning: STEERING BROKEN!!!", Canvas.width / 2, Canvas.height / 2);
    }
}

function MainLoop() {
    if (CurrentState === "Menu") {
        DrawMenu();
    } else if (CurrentState === "HowToPlay") {
        DrawHowToPlay();
    } else if (CurrentState === "Playing") {
        UpdateGame();
        DrawGame();
    }
    requestAnimationFrame(MainLoop);
}

MainLoop();
}