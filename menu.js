(function()
{
    window.addEventListener("load", main);
}());

var sound;

function main()
{
    sound = new Audio("move.wav");
    /*get buttons and add listeners to them*/
    var newGame = document.getElementById("newGame");
    var cont = document.getElementById("continue");
    var options = document.getElementById("options");
    var quit = document.getElementById("quit");
    /*add listeners to hover effect*/
    newGame.addEventListener("click", btnClicked);
    cont.addEventListener("click", btnClicked);
    options.addEventListener("click", btnClicked);
    quit.addEventListener("click", btnClicked);
    /*out of hover effect*/
    newGame.addEventListener("mouseout", mouseOut);
    cont.addEventListener("mouseout", mouseOut);
    options.addEventListener("mouseout", mouseOut);
    quit.addEventListener("mouseout", mouseOut);
    /*add listeners to clicked buttons*/
    newGame.addEventListener("mouseover", mouseHover);
    cont.addEventListener("mouseover", mouseHover);
    options.addEventListener("mouseover", mouseHover);
    quit.addEventListener("mouseover", mouseHover);
}
function mouseOut(ev) {
    /*get button and currentTarget*/
    var target = ev.target;
    var currentTarget = ev.currentTarget;
    /*return text and color to original state*/
    target.style.fontSize = "100%";
    target.style.color = "white";
    /*add currentTarget and set it to the corner*/
    currentTarget.style.backgroundImage = "none";
}
function mouseHover(ev) {
    /*get button and image*/
    var target = ev.target;
    var currentTarget = ev.currentTarget;
    /*increase text and change color*/
    target.style.fontSize = "120%";
    target.style.color = "grey";
    /*add image and set it to the corner*/
    currentTarget.style.backgroundImage = "url(\"gun_white.svg\")";
    currentTarget.style.backgroundRepeat = "no-repeat";
    currentTarget.style.backgroundSize = "contain";
    currentTarget.style.backgroundPosition = "0px 0px";
}
function btnClicked(ev) {
    /*get id*/
    var id = ev.target.id;
    /*get button and image*/
    var target = ev.target;
    var currentTarget = ev.currentTarget;
    /*change button text color*/
    switch(id){
        case "newGame":

            break;
        case "continue":

            break;
        case "options":

            break;
        case "quit":

            break;
    }
}