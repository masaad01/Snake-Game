const timeInterval = 200;
const size = {x: 18, y:10};// x = 1.75*y (approx for my screen)

var count=0;
function Snake(){
    this.snakelength = 1;
    this.arrow = "r";
    this.headPosition = "";
    this.tailPosition = "";
    this.grid = Array2d(size.x,size.y);
    this.gameOver = true;
    this.maxScore = 0;
    this.lastScore = 0
    this.interval = "";
    this.playedMove = true;

    this.begin = function(){
        this.gameOver = false;
        this.grid[this.headPosition.x][this.headPosition.y] = -5;
        this.interval = setInterval(this.play.bind(this), timeInterval,this.arrow);
    }
    this.initialize = function(){
        clearInterval(this.interval);
        this.snakelength = 1;
        this.arrow = "r";
        this.headPosition = {x: parseInt(size.x/2), y: parseInt(size.y/2)};
        this.tailPosition = {x: parseInt(size.x/2), y: parseInt(size.y/2)};
        this.grid = Array2d(size.x,size.y);
        this.grid = iniArray2d(this.grid,0);
        this.gameOver = true;

        for(let i=0;i< size.x * size.y * 1/100; i++)//percentage of multiple food
            this.generateFood();
    }
    this.playOld = function(){
        ar = this.arrow;
        if(this.gameOver){
            return;
        }
        //this.arrow = ar;
        //fun(this.arrow);
        switch(ar){
            case "r": this.headPosition.x++;break;
            case "l": this.headPosition.x--;break;
            case "u": this.headPosition.y--;break;
            case "d": this.headPosition.y++;break;
        }
        this.headPosition.x = this.validX(this.headPosition.x);
        this.headPosition.y = this.validY(this.headPosition.y);
        
        if(this.grid[this.headPosition.x][this.headPosition.y] == 0){
            this.grid[this.headPosition.x][this.headPosition.y] = -this.snakelength;
            //fun("play\n"+this.headPosition.x+","+this.headPosition.y);
            this.moveBody(this.headPosition.x,this.headPosition.y);
        }
        else if(this.grid[this.headPosition.x][this.headPosition.y] == 1){
            this.snakelength++;
            this.grid[this.headPosition.x][this.headPosition.y] = -this.snakelength;
            this.generateFood();
        }
        else if(this.grid[this.headPosition.x][this.headPosition.y] != -1)
            this.endGame();
        
        //this.playedMove = true;
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
            this.grid[this.headPosition.x][this.headPosition.y] = ar;
            this.generateFood();
        }
        else //if(this.grid[this.headPosition.x][this.headPosition.y] != -1)
            this.endGame();
        
        //this.playedMove = true;
    }
    this.moveBodyOld = function(x,y){
        while(this.grid[x][y] < 0){
            let found = false;
            for(let i=0;i<3 && !found;i++)
                for(let j=0;j<3;j++)
                    if(this.grid[this.validX(x-1+i)][this.validY(y-1+j)] == this.grid[x][y] && !(i==1 && j==1)){
                        x = this.validX(x-1+i);
                        y = this.validY(y-1+j);
                        //fun("in"+x+","+y);
                        found=true;
                        break;
                    }
            this.grid[x][y]++;
        }
    }
    this.moveBody = function(){
        let ar  = this.grid[this.tailPosition.x][this.tailPosition.y];
        this.grid[this.tailPosition.x][this.tailPosition.y] = 0;

        //(this.grid[this.tailPosition.x][this.tailPosition.y] == "h")

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
        if(ar == "r" && this.arrow == "l")return;
        if(ar == "l" && this.arrow == "r")return;
        if(ar == "u" && this.arrow == "d")return;
        if(ar == "d" && this.arrow == "u")return;

        //if(!this.playedMove)return;

        this.arrow = ar;
        
        //this.playedMove = false;
        this.play();
    }
    this.endGame = function(){
        this.gameOver = true;
        this.maxScore = Math.max(this.maxScore, this.snakelength);
        this.lastScore = this.snakelength;
    }
}

function SnakeGUI(){
    this.cells = "";
    this.game = new Snake();
    this.buttons = {r: "", l: "", u: "", d: "", reset: ""};
    this.scoreBoard = {highest: "", last: "", now: ""};
    this.refresh = "";

    this.start = function(){
        this.creatElements();
        this.addEvents();
        this.reset();
    }
    this.creatElements = function(){
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";

        var container = htmlCreator("div",body,"container","");
        var mainSection = htmlCreator("div",container,"mainSec","view");
        var scoreSection = htmlCreator("div",container,"scoreSec","view");
        var controlsSection = htmlCreator("div",container,"controlsSec","view");

        htmlCreator("div", scoreSection, "", "", "Highest Score");
        this.scoreBoard.highest = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Last Score");
        this.scoreBoard.last = htmlCreator("div", scoreSection);
        htmlCreator("div", scoreSection, "", "", "Score");
        this.scoreBoard.now = htmlCreator("div", scoreSection);
        
        this.buttons.u = htmlCreator("button", controlsSection, "upButton", "button", "&uarr;");
        this.buttons.l = htmlCreator("button", controlsSection, "leftButton", "button", "&larr;");
        this.buttons.r = htmlCreator("button", controlsSection, "rightButton", "button", "&rarr;");
        this.buttons.d = htmlCreator("button", controlsSection, "downButton", "button", "&darr;");
        this.buttons.reset = htmlCreator("button", controlsSection, "resetButton", "button", "Begin");
        
        this.setMapSize(size.x,size.y);
        var c = Array2d(size.x,size.y);
        for(var i=0;i<size.y;i++)
            for(var j=0;j<size.x;j++)
                c[j][i] = htmlCreator("div", mainSection,"","emptyCell");
        this.cells = c;
    }
    this.addEvents = function(){
        var self = this;
        this.buttons.r.addEventListener("click",function(){self.game.changeDirection("r");self.display();}, false);
        this.buttons.l.addEventListener("click",function(){self.game.changeDirection("l");self.display();}, false);
        this.buttons.u.addEventListener("click",function(){self.game.changeDirection("u");self.display();}, false);
        this.buttons.d.addEventListener("click",function(){self.game.changeDirection("d");self.display();}, false);
        
        document.addEventListener("keydown",function(event){
            //if(!event.repeat)
                switch(event.code){
                    case "ArrowRight":self.game.changeDirection("r");self.display();break;
                    case "ArrowLeft" :self.game.changeDirection("l");self.display();break;
                    case "ArrowUp"   :self.game.changeDirection("u");self.display();break;
                    case "ArrowDown" :self.game.changeDirection("d");self.display();break;
                    case "keyl" :self.game.logGrid();break;
                }
        } );

        this.buttons.reset.addEventListener("click",function(){
            if(this.innerHTML == "Reset"){
                self.game.endGame();
                self.display();
                self.reset();
            }
            else{
                this.innerHTML = "Reset";
                self.game.begin();
                self.display();
                self.refresh = setInterval(self.display.bind(self),timeInterval);
            }
        }, false);
    }
    this.display = function(){
        for(let i=0;i<size.x;i++)
            for(let j=0;j<size.y;j++)
                if(this.game.grid[i][j] == 1){
                    this.cells[i][j].style.backgroundColor = "red";
                    this.cells[i][j].innerHTML = "";
                }
                else if(this.game.grid[i][j] == 0){
                    this.cells[i][j].style.backgroundColor = "white";
                    this.cells[i][j].innerHTML = "";
                }
                else{
                    this.cells[i][j].style.backgroundColor = "#45bb21";
                    switch(this.game.grid[i][j]){
                        case -1: this.cells[i][j].innerHTML = "&rarr;";break;
                        case -2: this.cells[i][j].innerHTML = "&larr;";break;
                        case -3: this.cells[i][j].innerHTML = "&uarr;";break;
                        case -4: this.cells[i][j].innerHTML = "&darr;";break;
                    }
                }
        this.cells[this.game.tailPosition.x][this.game.tailPosition.y].innerHTML = ".";
        this.cells[this.game.headPosition.x][this.game.headPosition.y].style.backgroundColor = "green";
        this.cells[this.game.headPosition.x][this.game.headPosition.y].innerHTML = "#";
        this.scoreBoard.now.innerHTML = this.game.snakelength;

        if(this.game.gameOver){
            alert("Game Over\n"+this.game.lastScore)
            this.reset();
        }
    }
    this.reset = function(){
        clearInterval(this.refresh);
        this.game.initialize();

        this.scoreBoard.highest.innerHTML = this.game.maxScore;
        this.scoreBoard.last.innerHTML = this.game.lastScore;
        this.scoreBoard.now.innerHTML = 0;

        this.buttons.reset.innerHTML = "Begin";
    }
    this.setMapSize = function(x,y){
        var root = document.querySelector(":root");
        root.style.setProperty("--sizeX",x);
        root.style.setProperty("--sizeY",y);
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