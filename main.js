class Block {
	constructor(x,y,number,element){
		this.x=x;
		this.y=y;
		this.number=number;
		this.element=element;
		if (this.number==0) this.isEmpty=true;
		else this.isEmpty=false;
	}
}
const BlocksArray= {
	blocks:[],
	xNull:0,
	yNull:0,
	linkElement(){
		elemets=document.querySelectorAll("block");
		
	}
}
const GemPuzzle = {
  properties: {
	  sounds:true,
	  size:4,
  },
  elements:{
	  gameBoard:0,
  },
  instanceProperties: {
	 isActive:false,
	 counts:true,
	 gameField:[],
	 numOfSteps:0,
	 time:0,
  },
  initGameBoard(){
	this.elements.gameBoard = document.createElement("div");
	this.elements.gameBoard.classList.add("game-board");
	Menu.elements.wrapperElement.appendChild(this.elements.gameBoard);
  },
  shuffle(){
	let arr = new Array();
	for(let i=0;i<this.properties.size*this.properties.size;i++) arr.push(i);
  	let shuffled = arr
  	.map((a) => ({sort: Math.random(), value: a}))
  	.sort((a, b) => a.sort - b.sort)
	.map((a) => a.value)
	if (this.checkShuffle(shuffled)){
		for(let j=0;j<this.properties.size;j++){
			this.instanceProperties.gameField.push(new Array(this.properties.size));
			for(let i=0;i<this.properties.size;i++){
			  this.instanceProperties.gameField[j][i] = shuffled[(j*this.properties.size)+i];
			}
		}
	} else{
		this.shuffle();
	}
  },
  checkShuffle(a){
	let inv = 0;
	for (let i=0; i<(this.properties.size*this.properties.size); ++i){
		if (a[i]!=0){ 
			for (let j=0; j<i; ++j) if (a[j] > a[i]) ++inv;
		}
		for (let i=0; i<(this.properties.size*this.properties.size); ++i) {
		if (a[i] == 0) inv += 1 + Math.floor(i/this.properties.size);		
		}
	}
	return ((inv+1) % 2);
  },
  initInstance(){
   this.shuffle();
   for(let j=0;j<this.properties.size;j++){
	BlocksArray.blocks.push(new Array(this.properties.size));
	for(let i=0;i<this.properties.size;i++){
	  block = document.createElement("div");
	  block.classList.add("block");
	  block.innerText = this.instanceProperties.gameField[j][i]; 
	  this.elements.gameBoard.appendChild(block.cloneNode(true));
	  BlocksArray.blocks[j][i] = new Block(i,j,this.instanceProperties.gameField[j][i],block);
	  }
	}
	this.updateInstance();
  },
  updateInstance(){
	
  }

}





const Menu = {
	elements: {
		wrapperElement:0,
		menuElement:0,
		newGameButton:0,
		savedGameButton:0,
		recordsButton:0,
		fieldSizeSelector:0
	},
	init() {
		this.elements.wrapperElement = document.createElement("div");
		this.elements.menuElement = document.createElement("div");
		this.elements.newGameButton = document.createElement("span");
		this.elements.savedGameButton = document.createElement("span");
		this.elements.recordsButton = document.createElement("span");
		this.elements.fieldSizeSelector = document.createElement("select");
        	
		// Setup main elements
		this.elements.wrapperElement.classList.add("wrapper");
		this.elements.newGameButton.innerText="New Game";
		this.elements.savedGameButton.innerText="Saved Game";
		this.elements.recordsButton.innerText="Records";
		this.elements.menuElement.classList.add("menu");
		this.elements.fieldSizeSelector.setAttribute("size", "1");
		option = document.createElement("option");
		option.innerText = "3x3";
		option.setAttribute("value","3");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "4x4";
		option.setAttribute("value","4");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "5x5";
		option.setAttribute("value","5");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "8x8";
		option.setAttribute("value","8");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		this.elements.fieldSizeSelector.value = "4";
	
		// Add to DOM
		this.elements.menuElement.appendChild(this.elements.newGameButton);
		this.elements.menuElement.appendChild(this.elements.savedGameButton);
		this.elements.menuElement.appendChild(this.elements.recordsButton);
		this.elements.menuElement.appendChild(this.elements.fieldSizeSelector);
		this.elements.wrapperElement.appendChild(this.elements.menuElement);
		document.body.appendChild(this.elements.wrapperElement);
	},
    toggleHide(){
		this.elements.menuElement.classList.toggle("hide");
	}
}
Menu.init();
Menu.toggleHide();
GemPuzzle.initGameBoard();
GemPuzzle.initInstance();
