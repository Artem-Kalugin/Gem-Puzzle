
const GemPuzzle = {
  properties: {
	  sounds:true,
	  size:3,
  },
  elements:{
	  gameBoard:0,
  },
  instanceProperties: {
	 isActive:false,
	 counts:true,
	 gameField:[],
	 elementLinks:[],
	 numOfSteps:0,
	 time:0,
	 nullX:0,
	 nullY:0
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
			this.instanceProperties.elementLinks.push(new Array(this.properties.size));
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
	for(let i=0;i<this.properties.size;i++){
	  block = document.createElement("div");
	  block.classList.add("block");
	  block.innerText = this.instanceProperties.gameField[j][i]; 
	  if (block.innerText==0){
		block.classList.toggle("hide");
		this.instanceProperties.nullX=i;
		this.instanceProperties.nullY=j;
	  }
	  this.elements.gameBoard.appendChild(block.cloneNode(true));
	  }
	}
	this.updateInstance();
  },
  updateInstance(){
	let blocks = document.querySelectorAll(".block");
	blocks.forEach(el=>{
		el.classList.remove("block_active");
		el.removeEventListener("click",()=>{
			this.swap(el)}
		)
	})
	let nullX=this.instanceProperties.nullX;
	let nullY=this.instanceProperties.nullY;
	let arr = [];
	if (nullX>0) arr.push(this.instanceProperties.gameField[nullY][nullX-1]);
	if (nullX<(this.properties.size-1)) arr.push(this.instanceProperties.gameField[nullY][nullX+1]);
	if (nullY>0) arr.push(this.instanceProperties.gameField[nullY-1][nullX]);
	if (nullY<(this.properties.size-1)) arr.push(this.instanceProperties.gameField[nullY+1][nullX]);
	blocks.forEach(el=>{
		if (arr.includes(parseInt(el.innerText,10))) {
			el.classList.add("block_active");
			el.addEventListener("click",()=>{
				this.swap(el)}
			);
		}
	})
	this.checkWin();
  },
  checkWin(){
	let checker=[].concat.apply([],this.instanceProperties.gameField);
	checker.splice(-1,1);
	checker2=checker.join('');
	checker1=checker.sort((a, b) => a - b).join('');
	if (checker1==checker2) alert("win");
  },
  swap(el){
	  if (el.classList.contains("block_active")){
	  let x,y;
	  for(let i=0; i<this.properties.size;i++){
		  let index = this.instanceProperties.gameField[i].indexOf(parseInt(el.innerText,10))
		  if (index!=-1){
		   x=index;
		   y=i;
		   break;
		}
	  }
	  let buff = this.instanceProperties.gameField[y][x];
	  let nullEl=document.querySelector(".hide");
	  nullEl.classList.remove("hide");
	  el.classList.add("hide");
	  nullEl.innerText=buff;
	  el.innerText=0;
	  this.instanceProperties.gameField[this.instanceProperties.nullY][this.instanceProperties.nullX] = buff;
	  this.instanceProperties.gameField[y][x] = 0;
	  this.instanceProperties.nullX=x;
	  this.instanceProperties.nullY=y;
	  this.updateInstance();
	
	}
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
		this.elements.menuElement.classList.toggle("hide_menu");
	}
}
Menu.init();
Menu.toggleHide();
GemPuzzle.initGameBoard();
GemPuzzle.initInstance();
