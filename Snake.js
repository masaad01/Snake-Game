let timeInterval = 200;
let speed = 5;   //auto calculated apon reload. speed = 1000/timeInterval
const size = {x: undefined, y:5};//x = 1.75*y (approx for my screen) it is auto calculated

let foodPercentage = 1/100;                         //percentage of multiple food but they 
                                                     //may overlap so the actual max percentage
                                                     //is around 50% and the number will dimminsh
                                                     //with every turn
let food = 1;   //food is auto calculated depending on foodPercentage
let count=0;


function Snake(){
    //private vars
    let snakelength = 1;
    let grid = undefined;
    let gameOver = true; 
    const score = {max: 0, last:0 , now:0};
    const pos = {head: undefined, tail: undefined};
    const arrow = {head: "r" , last: undefined , tail: undefined}; 
    //read only vars:
    Object.defineProperties(this, {
        "grid": {get: () => grid},
        "score": {get: () => score},
        "arrow": {get: () => arrow},
        //write false to start game
        "gameOver" : {
            get: () => gameOver,
            set: function(value){
                if(!value)
                    gameOver = false;
            }
        }
    });


    //private methods
    const moveBody = function(){
        let ar  = grid[pos.tail.x][pos.tail.y];
        //arrow.head.tail;
        grid[pos.tail.x][pos.tail.y] = 0;

        switch(ar){
            case -1: pos.tail.x++;break;
            case -2: pos.tail.x--;break;
            case -3: pos.tail.y--;break;
            case -4: pos.tail.y++;break;
            default: fun("mb\n"+ar);
        }
        
        pos.tail.x = validX.bind(this)(pos.tail.x);
        pos.tail.y = validY.bind(this)(pos.tail.y);
    }
    const validX = function(x){
        return (x+size.x)%size.x;
    }
    const validY = function(y){
        return (y+size.y)%size.y;
    }
    const generateFood = function(){
        let x,y;
        do{
            x = Math.floor(Math.random()*size.x);
            y = Math.floor(Math.random()*size.y);
        }while(grid[x][y] < 0);//overlapp multiple food
        grid[x][y] = 1;
    }
    //public methods
    this.initialize = function(){

        snakelength = 1;
        arrow.head = "r";
        pos.head = {x: Math.floor(size.x/2), y: Math.floor(size.y/2)};
        pos.tail = {x: Math.floor(size.x/2), y: Math.floor(size.y/2)};
        grid = Array2d(size.x,size.y,0);
        score.now = 0;

        //console.log(typeof grid[0])
        grid[pos.head.x][pos.head.y] = -5;
        gameOver = true;

        for(let i=0;i< food; i++)
            generateFood.bind(this)();
    }
    this.play = function(){
        let ar = arrow.head;
        if(gameOver){
            return;
        }
        //arrow.head = ar;
        //fun(arrow.head);
        
        switch(ar){
            case "r": grid[pos.head.x][pos.head.y] = -1;/**/pos.head.x++;break;
            case "l": grid[pos.head.x][pos.head.y] = -2;/**/pos.head.x--;break;
            case "u": grid[pos.head.x][pos.head.y] = -3;/**/pos.head.y--;break;
            case "d": grid[pos.head.x][pos.head.y] = -4;/**/pos.head.y++;break;
        }
        pos.head.x = validX.bind(this)(pos.head.x);
        pos.head.y = validY.bind(this)(pos.head.y);
        
        if(grid[pos.head.x][pos.head.y] == 0){
            grid[pos.head.x][pos.head.y] = -5;
            //fun("play\n"+pos.head.x+","+pos.head.y);
            moveBody.bind(this)();
        }
        else if(grid[pos.head.x][pos.head.y] > 0){
            grid[pos.head.x][pos.head.y] = -5;
            //fun("play\n"+pos.head.x+","+pos.head.y);
            snakelength++;
            score.now += speed;
            generateFood.bind(this)();
        }
        else{ //if(grid[pos.head.x][pos.head.y] != -1)
            grid[pos.head.x][pos.head.y] = -5;
            this.endGame();
        }
        arrow.last=arrow.head;
        //this.playedMove = true;
    }
    this.changeDirection = function(ar){
        if(ar == "r" && arrow.last == "l")return;
        if(ar == "l" && arrow.last == "r")return;
        if(ar == "u" && arrow.last == "d")return;
        if(ar == "d" && arrow.last == "u")return;

        //if(!this.playedMove)return;

        arrow.head = ar;
        
        //this.playedMove = false;
        this.play();
    }
    this.endGame = function(){
        gameOver = true;
        score.last = score.now;
        score.max = Math.max(score.max, score.last);//score = length * speed
    }
}

function SnakeGUI(){
    //private vars
    let mainSection, canvas, ctx,cellSize = 0;
    const buttons = {r: undefined, l: undefined, u: undefined, d: undefined, reset: undefined};
    const input = {speed: undefined ,food: undefined};
    const scoreBoard = {highest: undefined, last: undefined, now: undefined};
    //public vars
    this.game = new Snake();
    this.step = 0;
    this.totalSteps = 12;
    this.stepTime =16.5;
    //private methods
    const creatElements = function(){
        let body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";

        let container = htmlCreator("div",body,"container","");
        mainSection = htmlCreator("div",container,"mainSec","view");
        let scoreSection = htmlCreator("div",container,"scoreSec","view");
        let controlsSection = htmlCreator("div",container,"controlsSec","view");

        htmlCreator("div", scoreSection, "", "", "Highest Score");
        scoreBoard.highest = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Last Score");
        scoreBoard.last = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Score");
        scoreBoard.now = htmlCreator("div", scoreSection);

        htmlCreator("label", controlsSection, "", "", "food:");
        input.food = htmlCreator("input", controlsSection, "","inputNumber");
        input.food.type = "number";
        input.food.min = "1";
        input.food.value = food;
        input.food.title = food;
        htmlCreator("label", controlsSection, "", "", "Speed:");
        input.speed = htmlCreator("input", controlsSection, "","inputNumber");
        input.speed.type = "number";
        input.speed.min = "1";
        input.speed.max = "20";
        input.speed.value = speed;
        input.speed.title = speed;
        
        buttons.u = htmlCreator("button", controlsSection, "upButton", "button", "&uarr;");
        buttons.l = htmlCreator("button", controlsSection, "leftButton", "button", "&larr;");
        buttons.r = htmlCreator("button", controlsSection, "rightButton", "button", "&rarr;");
        buttons.d = htmlCreator("button", controlsSection, "downButton", "button", "&darr;");
        buttons.reset = htmlCreator("button", controlsSection, "resetButton", "button", "Begin");
        
        canvas = htmlCreator("canvas" ,mainSection);
        canvas.height = mainSection.offsetHeight ;
        canvas.width = mainSection.offsetWidth;

    }
    const addEvents = function(){
        let self = this;
        buttons.r.addEventListener("click",function(){self.game.changeDirection("r");});
        buttons.l.addEventListener("click",function(){self.game.changeDirection("l");});
        buttons.u.addEventListener("click",function(){self.game.changeDirection("u");});
        buttons.d.addEventListener("click",function(){self.game.changeDirection("d");});
        
        input.food.addEventListener("change",function(){
            if(this.value > Math.floor(size.x * size.y * 0.6))
                this.value = Math.floor(size.x * size.y * 0.6);
            this.title = this.value + "\nreset game to change food percentage";
            food = this.value;
            self.reset();
        });
        //input.food.addEventListener("click",function(){this.title = this.value;});
        input.speed.addEventListener("change",function(){
            if(this.value > 20)
                this.value = 20;
            else if(this.value < 1)
                this.value = 1;
            this.title = this.value + "\nreset game to change speed";
            timeInterval = Math.floor(1000/this.value);
            self.reset();
        });
        input.speed.addEventListener("click",function(){this.title = this.value;});
        
        document.addEventListener("keydown",function(event){
            if(!event.repeat)
                switch(event.code){
                    case "ArrowRight":self.game.changeDirection("r");break;
                    case "ArrowLeft" :self.game.changeDirection("l");break;
                    case "ArrowUp"   :self.game.changeDirection("u");break;
                    case "ArrowDown" :self.game.changeDirection("d");break;
                    case "keyl" :self.game.logGrid();break;
                }
        } );

        buttons.reset.addEventListener("click",function(){
            if(this.innerHTML == "Reset"){
                self.game.endGame();
                self.reset();
            }
            else{
                self.game.gameOver = false;
                this.innerHTML = "Reset";
                requestAnimationFrame(self.display.bind(self));
            }
        });
    }
    const drawCell = function(x,y,color,type = "body" , ar =""){
        let c = cellSize;
        let space = (canvas.width - cellSize * size.x)/2;
        ctx.fillStyle = color;
        let d = this.step / this.totalSteps * c;
        let distX = 0,distY=0;

        if(type == "head"){
            switch(ar){
                case "r": 
                    ctx.fillRect(space+x*c , y*c , c/2 , c);
                    ctx.beginPath();
                    ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14/2*3,3.14/2);
                    ctx.fill();
                break;
                case "l":
                    ctx.fillRect(space+x*c +c/2, y*c , c/2 , c);
                    ctx.beginPath();
                    ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14/2,3.14/2*3);
                    ctx.fill();
                break;
                case "u":
                    ctx.fillRect(space+x*c , y*c +c/2, c , c/2);
                    ctx.beginPath();
                    ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14,0);
                    ctx.fill();
                break;
                case "d": 
                ctx.fillRect(space+x*c , y*c , c , c/2);
                ctx.beginPath();
                ctx.arc(space+x*c +c/2, y*c+c/2 ,c/2 ,0,3.14);
                ctx.fill();
                break;
            }
        }
        else if(type == "tail"){
            switch(ar){
                case "r": distX = d;break;
                case "l": distX = -d;break;
                case "u": distY = -d;break;
                case "d": distY = d;break;
            }
            ctx.fillRect(space+x*c - distX , y*c - distY , c , c);
        }
        else
            ctx.fillRect(space+x*c , y*c , c , c);
        
    }
    const clearCanvas = function(){
        let space = (canvas.width - cellSize * size.x)/2;

        ctx.clearRect(0,0,canvas.width,canvas.height);
                
        for(let i=0;i<size.y+1;i++){
            ctx.beginPath();
            ctx.moveTo(space+ 0, i * cellSize);
            ctx.lineTo(space+ cellSize * size.x, i * cellSize);
            ctx.stroke();
        }
        for(let i=0;i<size.x+1;i++){
            ctx.beginPath();
            ctx.moveTo(space+ i * cellSize,0);
            ctx.lineTo(space+ i * cellSize,canvas.height);
            ctx.stroke();
        }

    }
    //public methods
    this.start = function(){
        creatElements.bind(this)();
        
        cellSize = canvas.height / size.y;
        size.x = Math.floor(canvas.width / cellSize);
        
        food = Math.floor(size.x * size.y * foodPercentage);
        input.food.max = Math.floor(size.x * size.y * 0.6);
        if (food < 1)food = 1;
        
        ctx = canvas.getContext("2d");
        
        clearCanvas.bind(this)();
        addEvents.bind(this)();
        this.reset();
    }
    this.display = function(time){
        if(this.stepTime * this.step > timeInterval){
            this.game.play();
            //console.log(time , this.step , timeInterval);
            this.totalSteps = this.step;
            this.step = 0;
        }
        else{
            //console.log(this.step);
            this.step++;
        }
        clearCanvas.bind(this)();
        for(let i=0;i<size.x;i++)
            for(let j=0;j<size.y;j++)
                if(this.game.grid[i][j] == 1){
                    drawCell.bind(this)(i,j,"red");
                    //console.log(i,j);
                }
                else if(this.game.grid[i][j] == -5){
                    drawCell.bind(this)(i,j,"green","head" ,this.game.arrow.head);
                }
                else if (this.game.grid[i][j] != 0){
                    drawCell.bind(this)(i,j,"#45bb21");
                }
        scoreBoard.now.innerHTML = this.game.score.now;//score = length * speed
        
        if(!this.game.gameOver)
            requestAnimationFrame(this.display.bind(this));
        if(this.game.gameOver){
            alert("Game Over\n"+this.game.score.last)
            this.reset();
        }        
    }
    this.reset = function(){
        this.step = 0;
        this.game.initialize();

        speed = Math.floor(1000/timeInterval);//TI = 1000/speed
        this.totalSteps = 

        scoreBoard.highest.innerHTML = this.game.score.max;
        scoreBoard.last.innerHTML = this.game.score.last;
        scoreBoard.now.innerHTML = 0;

        buttons.reset.innerHTML = "Begin";
    }
}

function Array2d(x,y,value = undefined){
    let arr = [];
    for(let i=0;i<x;i++){
        arr[i] = [];
        for(let j=0;j<y;j++)
            arr[i][j]=value;
        //console.log(arr[i]);
    }
    return arr;
}
function htmlCreator(tag,parent,id="",clss="",inHTML=""){
    let t = document.createElement(tag);
    parent.appendChild(t);
    t.id = id;
    t.className = clss;
    t.innerHTML = inHTML;

    return t;
}
function fun(c=""){
    alert(c +"\n"+ count++);
}
