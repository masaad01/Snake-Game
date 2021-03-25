let timeInterval = 200;
let speed = 5;   //auto calculated apon reload. speed = 1000/timeInterval
const size = {x: undefined, y:5};//x = 1.75*y (approx for my screen) it is auto calculated

let foodPercentage = 1/100;                         //percentage of multiple food but they 
                                                     //may overlap so the actual max percentage
                                                     //is around 50% and the number will dimminsh
                                                     //with every turn
let food = 1;   //food is auto calculated depending on foodPercentage
var count=0;


function Snake(){
    this.snakelength = 1;
    this.lastArrow = "";
    this.arrow = "r";
    this.tailArrow = "r";
    this.headPosition = undefined;
    this.tailPosition = undefined;
    this.grid = undefined;
    this.gameOver = true;
    this.maxScore = 0;
    this.lastScore = 0;
    this.interval = undefined;
    this.playedMove = true;
    this.initialize = function(){
        //clearInterval(this.interval);
        this.snakelength = 1;
        this.arrow = "r";
        this.headPosition = {x: Math.floor(size.x/2), y: Math.floor(size.y/2)};
        this.tailPosition = {x: Math.floor(size.x/2), y: Math.floor(size.y/2)};
        this.grid = Array2d(size.x,size.y);
        this.grid = iniArray2d(this.grid,0);
        this.grid[this.headPosition.x][this.headPosition.y] = -5;
        this.gameOver = true;

        for(let i=0;i< food; i++)
            this.generateFood();
    }
    this.play = function(){
        let ar = this.arrow;
        if(this.gameOver){
            return;
        }
        //this.arrow = ar;
        //fun(this.arrow);
        
        switch(ar){
            case "r": this.grid[this.headPosition.x][this.headPosition.y] = -1;/**/this.headPosition.x++;break;
            case "l": this.grid[this.headPosition.x][this.headPosition.y] = -2;/**/this.headPosition.x--;break;
            case "u": this.grid[this.headPosition.x][this.headPosition.y] = -3;/**/this.headPosition.y--;break;
            case "d": this.grid[this.headPosition.x][this.headPosition.y] = -4;/**/this.headPosition.y++;break;
        }
        this.headPosition.x = this.validX(this.headPosition.x);
        this.headPosition.y = this.validY(this.headPosition.y);
        
        if(this.grid[this.headPosition.x][this.headPosition.y] == 0){
            this.grid[this.headPosition.x][this.headPosition.y] = -5;
            //fun("play\n"+this.headPosition.x+","+this.headPosition.y);
            this.moveBody();
        }
        else if(this.grid[this.headPosition.x][this.headPosition.y] > 0){
            this.grid[this.headPosition.x][this.headPosition.y] = -5;
            //fun("play\n"+this.headPosition.x+","+this.headPosition.y);
            this.snakelength++;
            this.generateFood();
        }
        else{ //if(this.grid[this.headPosition.x][this.headPosition.y] != -1)
            this.grid[this.headPosition.x][this.headPosition.y] = -5;
            this.endGame();
        }
        this.lastArrow=this.arrow;
        //this.playedMove = true;
    }
    this.moveBody = function(){
        this.tailArrow = this.grid[this.tailPosition.x][this.tailPosition.y];
        let ar  = this.tailArrow;
        this.grid[this.tailPosition.x][this.tailPosition.y] = 0;

        switch(ar){
            case -1: this.tailPosition.x++;break;
            case -2: this.tailPosition.x--;break;
            case -3: this.tailPosition.y--;break;
            case -4: this.tailPosition.y++;break;
            default: fun("mb\n"+ar);
        }
        
        this.tailPosition.x = this.validX(this.tailPosition.x);
        this.tailPosition.y = this.validY(this.tailPosition.y);
    }
    this.validX = function(x){
        return (x+size.x)%size.x;
    }
    this.validY = function(y){
        return (y+size.y)%size.y;
    }
    this.generateFood = function(){
        var x,y;
        do{
            x = Math.floor(Math.random()*size.x);
            y = Math.floor(Math.random()*size.y);
        }while(this.grid[x][y] < 0);//overlapp multiple food
        this.grid[x][y] = 1;
    }
    this.logGrid = function(){
        for(let i=0;i<size.x;i++){
            for(let j=0;j<size.y;j++)
                console.log(this.grid[i][j] + " ");
            console.log("\n");
        }
    }
    this.changeDirection = function(ar){
        if(ar == "r" && this.lastArrow == "l")return;
        if(ar == "l" && this.lastArrow == "r")return;
        if(ar == "u" && this.lastArrow == "d")return;
        if(ar == "d" && this.lastArrow == "u")return;

        //if(!this.playedMove)return;

        this.arrow = ar;
        
        //this.playedMove = false;
        //this.play();
    }
    this.endGame = function(){
        this.gameOver = true;
        this.lastScore = this.snakelength * speed;
        this.maxScore = Math.max(this.maxScore, this.lastScore);//score = length * speed
    }
}

function SnakeGUI(){
    this.mainSection = undefined;
    this.canvas = undefined;
    this.ctx = undefined;
    this.cellSize = 0;
    this.game = new Snake();
    this.buttons = {r: undefined, l: undefined, u: undefined, d: undefined, reset: undefined};
    this.input = {speed: undefined ,food: undefined};
    this.scoreBoard = {highest: undefined, last: undefined, now: undefined};
    this.refresh = undefined;
    this.step = 0;
    this.totalSteps = 12;
    this.stepTime =16.5;

    this.start = function(){
        this.creatElements();
        
        this.cellSize = this.canvas.height / size.y;
        size.x = Math.floor(this.canvas.width / this.cellSize);
        
        food = Math.floor(size.x * size.y * foodPercentage);
        this.input.food.max = Math.floor(size.x * size.y * 0.6);
        if (food < 1)food = 1;
        
        this.ctx = this.canvas.getContext("2d");
        
        this.clearCanvas();
        this.addEvents();
        this.reset();
    }
    this.creatElements = function(){
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";

        var container = htmlCreator("div",body,"container","");
        this.mainSection = htmlCreator("div",container,"mainSec","view");
        var scoreSection = htmlCreator("div",container,"scoreSec","view");
        var controlsSection = htmlCreator("div",container,"controlsSec","view");

        htmlCreator("div", scoreSection, "", "", "Highest Score");
        this.scoreBoard.highest = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Last Score");
        this.scoreBoard.last = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Score");
        this.scoreBoard.now = htmlCreator("div", scoreSection);

        htmlCreator("label", controlsSection, "", "", "food:");
        this.input.food = htmlCreator("input", controlsSection, "","inputNumber");
        this.input.food.type = "number";
        this.input.food.min = "1";
        this.input.food.value = food;
        this.input.food.title = food;
        htmlCreator("label", controlsSection, "", "", "Speed:");
        this.input.speed = htmlCreator("input", controlsSection, "","inputNumber");
        this.input.speed.type = "number";
        this.input.speed.min = "1";
        this.input.speed.max = "20";
        this.input.speed.value = speed;
        this.input.speed.title = speed;
        
        this.buttons.u = htmlCreator("button", controlsSection, "upButton", "button", "&uarr;");
        this.buttons.l = htmlCreator("button", controlsSection, "leftButton", "button", "&larr;");
        this.buttons.r = htmlCreator("button", controlsSection, "rightButton", "button", "&rarr;");
        this.buttons.d = htmlCreator("button", controlsSection, "downButton", "button", "&darr;");
        this.buttons.reset = htmlCreator("button", controlsSection, "resetButton", "button", "Begin");
        
        this.canvas = htmlCreator("canvas" ,this.mainSection);
        this.canvas.height = this.mainSection.offsetHeight ;
        this.canvas.width = this.mainSection.offsetWidth;

    }
    this.addEvents = function(){
        var self = this;
        this.buttons.r.addEventListener("click",function(){self.game.changeDirection("r");});
        this.buttons.l.addEventListener("click",function(){self.game.changeDirection("l");});
        this.buttons.u.addEventListener("click",function(){self.game.changeDirection("u");});
        this.buttons.d.addEventListener("click",function(){self.game.changeDirection("d");});
        
        this.input.food.addEventListener("change",function(){
            if(this.value > Math.floor(size.x * size.y * 0.6))
                this.value = Math.floor(size.x * size.y * 0.6);
            this.title = this.value + "\nreset game to change food percentage";
            food = this.value;
            self.reset();
        });
        //this.input.food.addEventListener("click",function(){this.title = this.value;});
        this.input.speed.addEventListener("change",function(){
            if(this.value > 20)
                this.value = 20;
            else if(this.value < 1)
                this.value = 1;
            this.title = this.value + "\nreset game to change speed";
            timeInterval = Math.floor(1000/this.value);
            self.reset();
        });
        this.input.speed.addEventListener("click",function(){this.title = this.value;});
        
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

        this.buttons.reset.addEventListener("click",function(){
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
    this.display = function(time){
        if(this.stepTime * this.step > timeInterval){
            this.game.play();
            //console.log(time , this.step , timeInterval);
            this.totalSteps = this.step;
            this.step = 0;
        }
        else{
            console.log(this.step);
            this.step++;
        }
        this.clearCanvas();
        for(let i=0;i<size.x;i++)
            for(let j=0;j<size.y;j++)
                if(this.game.grid[i][j] == 1){
                    this.drawCell(i,j,"red");
                    console.log(i,j);
                }
                else if(this.game.grid[i][j] == -5){
                    this.drawCell(i,j,"green","head" ,this.game.arrow);
                }
                else if (this.game.grid[i][j] != 0){
                    this.drawCell(i,j,"#45bb21");
                }
        //this.cells[this.game.tailPosition.x][this.game.tailPosition.y].innerHTML = ".";
        //this.cells[this.game.headPosition.x][this.game.headPosition.y].innerHTML = "#";
        this.scoreBoard.now.innerHTML = this.game.snakelength * speed;//score = length * speed
        
        if(!this.game.gameOver)
            requestAnimationFrame(this.display.bind(this));
        if(this.game.gameOver){
            alert("Game Over\n"+this.game.lastScore)
            this.reset();
        }        
    }
    this.reset = function(){
        this.step = 0;
        this.game.initialize();

        speed = Math.floor(1000/timeInterval);//TI = 1000/speed
        this.totalSteps = 

        this.scoreBoard.highest.innerHTML = this.game.maxScore;
        this.scoreBoard.last.innerHTML = this.game.lastScore;
        this.scoreBoard.now.innerHTML = 0;

        this.buttons.reset.innerHTML = "Begin";
    }
    this.clearCanvas = function(){
        let space = (this.canvas.width - this.cellSize * size.x)/2;

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                
        for(let i=0;i<size.y+1;i++){
            this.ctx.beginPath();
            this.ctx.moveTo(space+ 0, i * this.cellSize);
            this.ctx.lineTo(space+ this.cellSize * size.x, i * this.cellSize);
            this.ctx.stroke();
        }
        for(let i=0;i<size.x+1;i++){
            this.ctx.beginPath();
            this.ctx.moveTo(space+ i * this.cellSize,0);
            this.ctx.lineTo(space+ i * this.cellSize,this.canvas.height);
            this.ctx.stroke();
        }

    }
    this.drawCell = function(x,y,color,type = "body" , ar =""){
        let c = this.cellSize;
        let space = (this.canvas.width - this.cellSize * size.x)/2;
        this.ctx.fillStyle = color;
        let d = this.step / this.totalSteps * c;
        let distX = 0,distY=0;

        if(type == "head"){
            switch(ar){
                case "r": 
                    this.ctx.fillRect(space+x*c , y*c , c/2 , c);
                    this.ctx.beginPath();
                    this.ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14/2*3,3.14/2);
                    this.ctx.fill();
                break;
                case "l":
                    this.ctx.fillRect(space+x*c +c/2, y*c , c/2 , c);
                    this.ctx.beginPath();
                    this.ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14/2,3.14/2*3);
                    this.ctx.fill();
                break;
                case "u":
                    this.ctx.fillRect(space+x*c , y*c +c/2, c , c/2);
                    this.ctx.beginPath();
                    this.ctx.arc(space+x*c +c/2, y*c+c/2,c/2,3.14,0);
                    this.ctx.fill();
                break;
                case "d": 
                this.ctx.fillRect(space+x*c , y*c , c , c/2);
                this.ctx.beginPath();
                this.ctx.arc(space+x*c +c/2, y*c+c/2 ,c/2 ,0,3.14);
                this.ctx.fill();
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
            this.ctx.fillRect(space+x*c - distX , y*c - distY , c , c);
        }
        else
            this.ctx.fillRect(space+x*c , y*c , c , c);
        
    }
}

function Array2d(x,y){
    var arr = [];
    for(var i=0;i<x;i++)
        arr[i] = new Array(y);
    return arr;
}
function iniArray2d(arr2d,value){
    for(var i=0;i<arr2d.length;i++)
        for(var j=0;j<arr2d[0].length;j++)
            arr2d[i][j]=value;
    return arr2d;
}
function htmlCreator(tag,parent,id="",clss="",inHTML=""){
    var t = document.createElement(tag);
    parent.appendChild(t);
    t.id = id;
    t.className = clss;
    t.innerHTML = inHTML;

    return t;
}
function fun(c=""){
    alert(c +"\n"+ count++);
}
