 /*
 *		Title: app.js (part of Bacon Game Jam 06) (theme Rainbows) 
 * 		Author: Beau Bouchard (@BeauBouchard)
 *		Description: A little canvas game you may enjoy
 *          Note: This was abandoned shortly after starting. Them was less than motivating 
 */
 
 var game;
 
 function messagelog(text){
	console.log("## " + text);
}

//+------------------------------------------------+
//| 		GAME 				   |
//+------------------------------------------------+
function GAME () {
	this.turnNumber = 0;
	this.gamewindow = document.getElementById("game");
		this.canvas 		= document.createElement("canvas");
		this.context 		= this.canvas.getContext("2d");
		this.canvas.width 	= 512;
		this.canvas.height	= 334;
	this.tileList = [];
	this.countryList = [];
	this.playerList = [];

		//this.canvas.onmousemove = function (e) { mouseMove(e);};
		this.gamewindow.appendChild(this.canvas);
		
}
GAME.prototype = {
	initialize: function() {
		
		this.drawTiles();
		this.setupPlayers(4);
	},
	drawTiles:				function(){
		for(var y = 0; y<25;y++){
			var tileRow =[];
			for(var x = 0; x<25;x++){
				
				var t4 = new TILE(x,y);
				t4.initialize();
				tileRow.push(t4);
				t4.draw();
			}
			this.tileList.push(tileRow);
			//messagelog("Built Row"+y +":y   "+x+":x   ");
		}

		messagelog("Built "+this.tileList.length+"x"+this.tileList[0].length +"grid");
	},
	redrawTiles:			function(){
		this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
		for(var x = 0; x<this.tileList.length;x++){
			for(var y = 0; y<this.tileList[x].length;y++){
				var tile = this.tileList[x][y];
				tile.draw();
			}
		}
	},
	setupPlayers:			function(incPlayerCount){
		for(var i =1;i<=incPlayerCount;i++){
			var player = new PLAYER(i);
			this.playerList.push(player);
			player.setupCountry();
		}
		for(var d = 0; d<this.playerList.length;d++){
			this.playerList[d].setupCountry();
		}
	},
	getCanvas: function() {
		return this.canvas;
	},
	getTileList:				function(){
		return this.tileList;
	}
}

//+------------------------------------------------+
//| 		MAP 				   |
//+------------------------------------------------+
function MAP() {

}
MAP.prototype = {
	initialize: function() {

		
		//using 1024x768 game window will give me 64x48 tiles of 16 pixels
	}
}

//+------------------------------------------------+
//| 		PLAYER				   |
//+------------------------------------------------+
function PLAYER(incNumber) {
	this.playerNumber = incNumber;
	this.playerCountryList = [];
	
		if(this.playerNumber ==1){this.color="rgb(200,1,0)";}
		if(this.playerNumber ==2){this.color="rgb(62,24,100)";}
		if(this.playerNumber ==3){this.color="rgb(0,0,200)";}
		if(this.playerNumber ==4){this.color="rgb(200,0,200)";}
		
}
PLAYER.prototype = {
	initialize: function() {
		//
	},
	addCountry:				function(country){
		this.playerCountryList.push(country);
	},
	getColor:				function(){
		return this.color;
	},
	setupCountry:			function(incCountryCount){
				var cone2 = new COUNTRY(this.getColor());
				game.countryList.push(cone2);
				cone2.initialize();
				cone2.expand(getRandInt(400,200));
				this.addCountry(cone2);
				game.redrawTiles();
				
	}
	
}

//+------------------------------------------------+
//| 		COUNTRY 				   |
//+------------------------------------------------+

function COUNTRY(incColor) {
	this.countryTiles = [];
		this.startX;
		this.startY;
		this.currentX;
		this.currentY;
		this.stepCount;
		this.tileCount;
		this.yoffset;
		this.xoffset;
		this.color = incColor;
		this.invalidTimeout = 0;
}
COUNTRY.prototype = {
	initialize: function() {
		this.calculateCountry();

	},
	calculateCountry: function(){
		
		this.attemptStart();
	},
	attemptStart:				function(){
		
		var tempY = getRandInt(game.tileList.length-2,2);
		var tempX = getRandInt(game.tileList[tempY].length-2,2);
		if(tempY%2>0){tempY++;}
		var tile = game.tileList[tempY][tempX ];
		
		if(this.checkTile(tile)){
			
			//tile is fine
			messagelog("tile is fine: "+tempX+"::"+tempY );
			this.currentX = tile.getX();
			this.startX = tile.getX();
			this.currentY = tile.getY();
			this.startY = tile.getY();
			

			
			this.fill(this.currentY,this.currentX);
		}
		else
		{
			messagelog("tile is already owned by a country. Trying Again");
			if(this.invalidTimeout>100){}else{this.attemptStart();}
			
			this.invalidTimeout++;
		}
		
	},
	checkTile:					function(incTile){
		 
		var check = true;//true means its A OK, false means already used
		for(var d = 0;d<game.countryList.length;d++){
				//var countryTilesgame.countryList[d].getCountryTiles();
			for(var i = 0;i<game.countryList[d].countryTiles.length;i++){
					if(game.countryList[d].countryTiles[i] === incTile){
						//tile is already owned by a country.
						check =false;
					}
				}
			}
			if(!check){this.invalidTimeout++;}
				return check;
	},
	checkValidTile:				function(incx,incy){
		var check = false;//checking for out of bounds
		try{
		if((incy<=0)||(game.tileList.length=== 'undefined')){check=false;}
		if((incx<=0)||(game.tileList[incy].length=== 'undefined')){		check=false;}else{check=true;}
		
		}catch(e){
			console.log("checkValidTile error:",e);
			check=false;
		}
		if(!check){this.invalidTimeout++;}
		return check;
	},
	expand:				function(incvalue){
		this.stepCount = 1;
		for(var i = 0; i<incvalue;i++){
			
			
			if(this.invalidTimeout>=150){
				//give up 
				i=incvalue*2;
				messagelog("giving up on that yo");
				
				break;
			}
			else{
				this.getNextExpandTile();
			}
			
		}
		//game.redrawTiles();
		//incvalue is the number of tiles to expand this border
	},
	fill:							function(y,x){
		
		try{
			var tile = game.tileList[y][x];
			this.countryTiles.push(tile);
			tile.changeColor(this.color);
		}catch(e){		console.log("Country Fill Error:",e);		}
		//game.redrawTiles();
		//alert("step:"+x+"::"+y);
	},
	getNextExpandTile:				function(){
		//binding box of country = this.startX -this.height, 
		//	this.startX +this.height
		//alert("stepcount: "+this.stepCount);
		//Check to see if the tile to the side is still friendly. 
		if(this.stepCount==1){
			if((!this.checkValidTile(this.currentX,this.currentY-1))||(!this.checkTile(game.tileList[this.currentY-1][this.currentX]))){
				//location invailid
			}else{this.fill(this.currentY-1,this.currentX);}
		}
		if(this.stepCount==2){ //,x+1
			if((!this.checkValidTile(this.currentX+1,this.currentY))||(!this.checkTile(game.tileList[this.currentY][this.currentX+1]))){
				//location invailid
			}else{this.fill(this.currentY,this.currentX+1);}
		}
		if(this.stepCount==3){//y+1
			if((!this.checkValidTile(this.currentX,this.currentY+1))||(!this.checkTile(game.tileList[this.currentY+1][this.currentX]))){
				//location invailid
			}else{this.fill(this.currentY+1,this.currentX);}
		}
		if(this.stepCount==4){//y+2
			if((!this.checkValidTile(this.currentX,this.currentY+2))||(!this.checkTile(game.tileList[this.currentY+2][this.currentX]))){
				//location invailid
			}else{this.fill(this.currentY+2,this.currentX);	}
		}
		if(this.stepCount==5){//y+1//x-1
			if((!this.checkValidTile(this.currentX-1,this.currentY+1))||(!this.checkTile(game.tileList[this.currentY+1][this.currentX-1]))){
				//location invailid
			}else{this.fill(this.currentY+1,this.currentX-1);}
		}
		if(this.stepCount==6){//x-1
			if((!this.checkValidTile(this.currentX-1,this.currentY))||(!this.checkTile(game.tileList[this.currentY][this.currentX-1]))){
				//location invailid
			}else{this.fill(this.currentY,this.currentX-1);}
		}
		if(this.stepCount==7){//y-1x-1
			if((!this.checkValidTile(this.currentX-1,this.currentY-1))||(!this.checkTile(game.tileList[this.currentY-1][this.currentX-1]))){
				//location invailid
			}else{this.fill(this.currentY-1,this.currentX-1);}
		}
		if(this.stepCount==8){//y-2
			if((!this.checkValidTile(this.currentX,this.currentY-2))||(!this.checkTile(game.tileList[this.currentY-2][this.currentX]))){
				//location invailid
			}else{this.fill(this.currentY-2,this.currentX);}
		}
		if(this.stepCount==9){
			//back at start, reset stepcount
				this.stepCount=0;
			//pick a random direction to try again.
			var temp = getRandInt(1,5);
			if(temp==1){this.currentY=this.currentY-2;}
			if(temp==2){this.currentY=this.currentY+2;}
			if(temp==3){this.currentX=this.currentX+1;}
			if(temp==4){this.currentX=this.currentX-1;}
			if((!this.checkValidTile(this.currentX,this.currentY))||(!this.checkTile(game.tileList[this.currentY][this.currentX]))){
				//invalid
			}else{this.fill(this.currentY,this.currentX);	}
		}
		this.stepCount++;
		
		
		
		
	}
	
	
}

//+------------------------------------------------+
//| 		TILE 				   |
//+------------------------------------------------+
function TILE(dx,dy) {
	this.maxRolls = 10;
	this.selected = false;
	this.offset = 0;
	this.context 	= game.getCanvas().getContext("2d");
	this.x = dx;
	this.y = dy;
	this.fillStyle = "rgb(100,200,0)";
}
TILE.prototype = {
	initialize: function() {
		//Tiles will be Diamond shape, 16x16

	},
	draw: 		function(){
		var canvas		= game.getCanvas();
		if(this.y%2>0){
			//messagelog("attempting to draw1");
			this.context 	= canvas.getContext("2d");
			this.context.fillStyle= this.fillStyle;
			this.context.lineWidth = 3;
			this.context.strokeStyle="rgb(0,0,0)";
			this.context.beginPath();
			this.context.moveTo((this.x*16)+8+8,((this.y*8)));
			this.context.lineTo((this.x*16)+16+8,((this.y*8)+8));
			this.context.lineTo((this.x*16)+8+8,((this.y*8)+16));
			this.context.lineTo((this.x*16+8),((this.y*8)+8));
			this.context.closePath();
			this.context.fill();
		}
		else{
			//messagelog("attempting to draw2");
			this.context 	= canvas.getContext("2d");
			this.context.fillStyle= this.fillStyle;
			this.context.lineWidth = 3;
			this.context.strokeStyle="rgb(0,0,0)";
			this.context.beginPath();
			this.context.moveTo((this.x*16)+8,((this.y*8))); 		//x+8, y+0
			this.context.lineTo((this.x*16)+16,((this.y*8)+8));	//x+16, y+8
			this.context.lineTo((this.x*16)+8,((this.y*8)+16));		//x+8, y+16
			this.context.lineTo((this.x*16),((this.y*8)+8));		//x+0, y+8
			this.context.closePath();
			this.context.fill();
		}
	},
	changeColor:			function(incColor){
		this.fillStyle=incColor;
		//messagelog("Color changed to orange at: "+(this.x)+"::"+(this.y));
	
	},
	getX:						function(){
		return this.x;
	},
	getY:						function(){
		return this.y;
	}
	
}

function getRandInt(min, max){
	return Math.floor(Math.random() * (max-min)+min);
}

function mouseMove(e)
{
    var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
	messagelog("mouseX:"+ mouseX +"   mouseY:"+mouseY);
	messagelog("TileX:"+Math.floor(mouseX/16) +"   TileY:"+Math.floor(mouseY/8));
}

 game = new GAME();
 game.initialize();


