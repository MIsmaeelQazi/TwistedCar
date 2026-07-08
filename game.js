const Canvas = document.getElementById("gameCanvas");
const Ctx = Canvas.getContext("2d");

let CurrentState = "Menu";
let Player = {
    X:175,
    Y:500,
    Width:50,
    Height:80,
    Speed:5
}
let IsInverted = false;
let Keys = {};

window.addEventListener("keydown", (Event) => Keys[Event.key] = true);
window.addEventListener("keyup", (Event) => Keys[Event.key] = false);

setInterval(() => {
    if(CurrentState === "Playing") {
        IsInverted = !IsInverted;
    }
},6000);

function DrawMenu() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height)

    Ctx.fillStyle = "white";
    Ctx.font = "40px monospace";
    Ctx.textAlign = "center";
    Ctx.fillText("Retro Racer", Canvas.width/2, Canvas.height/2);

    Ctx.font = "20px monospace";
    Ctx.fillText("Press Enter to Start", Canvas.width/2,300);
    Ctx.fillText("Press H for how to play", Canvas.width/2,350);
    Ctx.fillText("Press C to credits", Canvas.width/2,400);

    if (keys["Enter"]) CurrentState = "Playing";
    if (keys["H"]) CurrentState = "HowToPlay";
    if (keys["C"]) CurrentState = "Credits";
}

function DrawHowToPlay() {
    Ctx.clearRect(0,0,Canvas.width, Canvas.height);
    Ctx.fillStyle = "white";
    Ctx.fillText("How to Play", Canvas.width/2, 200);
    Ctx.fillText
