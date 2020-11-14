
const GemPuzzle = {
	properties: {
		sounds: true,
		size: 4,
		SoundFile: new Audio('assets/BlockSound.mp3'),
	},
	elements: {
		gameBoard: 0,
	},
	instanceProperties: {
		isActive: false,
		isNewGame: true,
		counts: true,
		gameField: [],
		nullX: 0,
		nullY: 0
	},
	shuffle() {
		let arr = new Array();
		for (let i = 0; i < this.properties.size * this.properties.size; i++) arr.push(i);
		let shuffled = arr
			.map((a) => ({ sort: Math.random(), value: a }))
			.sort((a, b) => a.sort - b.sort)
			.map((a) => a.value)
		if (this.checkShuffle(shuffled)) {
			for (let j = 0; j < this.properties.size; j++) {
				this.instanceProperties.gameField.push(new Array(this.properties.size));
				for (let i = 0; i < this.properties.size; i++) {
					this.instanceProperties.gameField[j][i] = shuffled[(j * this.properties.size) + i];
				}
			}
		} else {
			this.shuffle();
		}
	},
	checkShuffle(a) {
		let inv = 0;
		for (let i = 0; i < (this.properties.size * this.properties.size); ++i) {
			if (a[i] != 0) {
				for (let j = 0; j < i; ++j) if (a[j] > a[i]) ++inv;
			}
			if (a[i] == 0 && !(this.properties.size % 2)) {
				inv += ((this.properties.size + 1 - Math.ceil((i + 1) / this.properties.size)) % 2);
			}
		}
		return ((inv + (this.properties.size) % 2) % 2);
	},
	initInstance() {
		this.elements.gameBoard = document.createElement("div");
		this.elements.gameBoard.classList.add("game-board");
		this.elements.gameBoard.style.setProperty("grid-template-rows", `repeat(${this.properties.size}, 1fr)`);
		this.elements.gameBoard.style.setProperty("grid-template-columns", `repeat(${this.properties.size}, 1fr)`);
		Menu.elements.wrapperElement.appendChild(this.elements.gameBoard);
		if (this.instanceProperties.isNewGame) {
			this.shuffle();
			controlsPanel.properties.time=0;
			controlsPanel.properties.steps=-1;
			controlsPanel.increaseSteps();
		}
		for (let j = 0; j < this.properties.size; j++) {
			for (let i = 0; i < this.properties.size; i++) {
				block = document.createElement("div");
				block.classList.add("block");
				block.innerText = this.instanceProperties.gameField[j][i];
				if (block.innerText == 0) {
					block.classList.toggle("hide");
					this.instanceProperties.nullX = i;
					this.instanceProperties.nullY = j;
				}
				this.elements.gameBoard.appendChild(block.cloneNode(true));
			}
		}
		this.updateInstance();
	},
	updateInstance() {
		let blocks = document.querySelectorAll(".block");
		blocks.forEach(el => {
			el.classList.remove("block_active");
			el.removeEventListener("click", () => {
				this.swap(el)
			}
			)
		})
		let nullX = this.instanceProperties.nullX;
		let nullY = this.instanceProperties.nullY;
		let arr = [];
		if (nullX > 0) arr.push(this.instanceProperties.gameField[nullY][nullX - 1]);
		if (nullX < (this.properties.size - 1)) arr.push(this.instanceProperties.gameField[nullY][nullX + 1]);
		if (nullY > 0) arr.push(this.instanceProperties.gameField[nullY - 1][nullX]);
		if (nullY < (this.properties.size - 1)) arr.push(this.instanceProperties.gameField[nullY + 1][nullX]);
		blocks.forEach(el => {
			if (arr.includes(parseInt(el.innerText, 10))) {
				el.classList.add("block_active");
				el.addEventListener("click", () => {
					this.swap(el)
				}
				);
			}
		})
		this.checkWin();
	},
	checkWin() {
		let checker = [].concat.apply([], this.instanceProperties.gameField);
		checker.splice(-1, 1);
		checker2 = checker.join('');
		checker1 = checker.sort((a, b) => a - b).join('');
		if (checker1 == checker2){
			form.init();
			form.showMessage(`Ура!Вы решили головоломку за ${controlsPanel.addZero(Math.floor(controlsPanel.properties.time/60))}:${controlsPanel.addZero(controlsPanel.properties.time%60)} и ${controlsPanel.properties.steps} ходов`);
			this.clearInstance();
			this.instanceProperties.isNewGame=true;
			Menu.toggleHide();
			controlsPanel.deletePanel();
			
		}
	},
	swap(el) {
		if (el.classList.contains("block_active")) {
			let x, y;
			for (let i = 0; i < this.properties.size; i++) {
				let index = this.instanceProperties.gameField[i].indexOf(parseInt(el.innerText, 10))
				if (index != -1) {
					x = index;
					y = i;
					break;
				}
			}
			if (this.properties.sounds) this.properties.SoundFile.play();
			let buff = this.instanceProperties.gameField[y][x];
			let nullEl = document.querySelector(".hide");
			nullEl.classList.remove("hide");
			el.classList.add("hide");
			nullEl.innerText = buff;
			el.innerText = 0;
			this.instanceProperties.gameField[this.instanceProperties.nullY][this.instanceProperties.nullX] = buff;
			this.instanceProperties.gameField[y][x] = 0;
			this.instanceProperties.nullX = x;
			this.instanceProperties.nullY = y;
			this.updateInstance();
			controlsPanel.increaseSteps();
		}
	},
	clearInstance(){
	   removing = document.querySelector(".game-board");
	   removing.remove();
	   this.instanceProperties.isNewGame=true;
	   controlsPanel.elements.stepsElement.innerText=0;
	   controlsPanel.elements.timeElement.innerText=`00:00`;
	   this.instanceProperties.gameField = [];
	}
}



const controlsPanel = {
	elements: {
		wrapper: 0,
		timeElement: 0,
		stepsElement: 0,
		saveButton: 0,
		retryButton: 0,
		loseButton: 0,
		soundButton:0,
	},
	properties: {
		time: 0,
		steps: 0,
		timeId:0,
	},
	init() {
		this.elements.wrapper = document.createElement("div");
		this.elements.saveButton = document.createElement("span");
		this.elements.retryButton = document.createElement("span");
        this.elements.soundButton = document.createElement("span");
		this.elements.timeElement = document.createElement("span");
		this.elements.stepsElement = document.createElement("span");
		
		this.elements.stepsElement.innerText=this.properties.steps;

		this.elements.saveButton.innerHTML = `<i class="fas fa-save">`;
		this.elements.retryButton.innerHTML = `<i class="fas fa-undo">`;
		this.elements.soundButton.innerHTML = `<i class="fas fa-volume-up"></i>`;

		this.elements.retryButton.addEventListener("click",()=>{this.generateNewInstance()});
		this.elements.saveButton.addEventListener("click",()=>{this.saveInstance()});
        this.elements.soundButton.addEventListener("click",()=>{this.toggleSound()});

		this.elements.wrapper.appendChild(this.elements.timeElement);
		this.elements.wrapper.appendChild(this.elements.retryButton);
		this.elements.wrapper.appendChild(this.elements.saveButton);
		this.elements.wrapper.appendChild(this.elements.soundButton);
		this.elements.wrapper.classList.add("flex");
		if (GemPuzzle.properties.size == 4) {
			this.elements.loseButton = document.createElement("span");
			this.elements.loseButton.innerHTML = `<i class="far fa-flag"></i>`;
			this.elements.wrapper.appendChild(this.elements.loseButton);
		}
		this.elements.wrapper.appendChild(this.elements.stepsElement);

		document.body.appendChild(this.elements.wrapper);
		this.countTime();

	},
	toggleSound(){
		GemPuzzle.properties.sounds=!GemPuzzle.properties.sounds;
	},
	saveInstance(){
       let savedGame={
		   time:controlsPanel.properties.time,
		   steps:controlsPanel.properties.steps,
		   size:GemPuzzle.properties.size,
		   gameField:GemPuzzle.instanceProperties.gameField,
	   }
	   localStorage.setItem("savedGame",JSON.stringify(savedGame));
	},
	generateNewInstance(){
	   GemPuzzle.clearInstance();
	   GemPuzzle.initInstance();
	},
	countTime(){
		this.elements.timeElement.innerText=`${controlsPanel.addZero(Math.floor(this.properties.time/60))}:${controlsPanel.addZero(this.properties.time%60)}`;
		this.properties.time++;
		this.properties.timeId=setTimeout(function()
		{controlsPanel.countTime()},1000);
	},
	increaseSteps(){
		this.properties.steps++;
		this.elements.stepsElement.innerText=this.properties.steps;		
	},
	deletePanel(){
		clearTimeout(this.properties.timeId);
        this.elements.wrapper.remove();
	},
	addZero(num){
		if (num<10) return "0"+num;
		return num;
	}
}
const form = {
	elements: {
	   wrapperElement:0,
	   closeButtonElement:0,
	   containerElement:0,
	   addElement:0,	   
	},
	init(){
	   this.elements.wrapperElement = document.createElement("div");
	   this.elements.containerElement = document.createElement("div");
	   this.elements.closeButtonElement = document.createElement("button");

	   this.elements.wrapperElement.classList.add("form-wrapper");
	   this.elements.containerElement.classList.add("container");
	   this.elements.closeButtonElement.classList.add("close-form-button");
		 
	   this.elements.closeButtonElement.innerText="OK";

	   this.elements.closeButtonElement.addEventListener("click",()=>{this.closeForm();});
	   this.elements.wrapperElement.appendChild(this.elements.containerElement);
	   this.elements.wrapperElement.appendChild(this.elements.closeButtonElement);
	},
	addRecordsToForm(){
	   this.elements.addElement = document.createElement("div");
	   if (localStorage.getItem("records")!=null) {
		   this.elements.addElement.classList.add("records-grid");
		   this.elements.addElement.appendChild(document.createElement("span").innerText="Место");
		   this.elements.addElement.appendChild(document.createElement("span").innerText="Время");
		   this.elements.addElement.appendChild(document.createElement("span").innerText="Ходы");
		   records=JSON.parse(localStorage.getItem("records"));
		   records.forEach((el,index)=>{
			this.elements.addElement.appendChild(document.createElement("span").innerText=index);
			this.elements.addElement.appendChild(document.createElement("span").innerText=el.time);
			this.elements.addElement.appendChild(document.createElement("span").innerText=el.steps);
		   })
		   this.elements.containerElement.appendChild(this.elements.addElement);
		   this.showForm();
	   } else {
		 this.elements.containerElement.appendChild(document.createElement("span").innerText="Нет рекордов!");
		 this.showForm();
	   }
	},
	showMessage(message){
	  messageEl=document.createElement("span");
	  messageEl.innerText=message;
	  this.elements.containerElement.appendChild(messageEl);
	  this.showForm();
	},
	showForm(){
	  document.querySelector(".wrapper").appendChild(this.elements.wrapperElement);
	},
	closeForm(){
	   this.elements.wrapperElement.remove();
	   this.elements.wrapperElement=0;
	   this.elements.containerElement=0;
	   this.elements.addElement=0;
	   
	}
}

const Menu = {
	elements: {
		wrapperElement: 0,
		menuElement: 0,
		newGameButton: 0,
		savedGameButton: 0,
		recordsButton: 0,
		fieldSizeSelector: 0
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
		this.elements.newGameButton.innerText = "New Game";

		this.elements.newGameButton.addEventListener("click",()=>{this.startNewGame()});
		this.elements.savedGameButton.addEventListener("click",()=>{this.loadSaved()});

		this.elements.savedGameButton.innerText = "Saved Game";
		this.elements.recordsButton.innerText = "Records";
		this.elements.menuElement.classList.add("menu");
		this.elements.fieldSizeSelector.setAttribute("size", "1");
		option = document.createElement("option");
		option.innerText = "3x3";
		option.setAttribute("value", "3");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "4x4";
		option.setAttribute("value", "4");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "5x5";
		option.setAttribute("value", "5");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "6x6";
		option.setAttribute("value", "6");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "7x7";
		option.setAttribute("value", "7");
		this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
		option.innerText = "8x8";
		option.setAttribute("value", "8");
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
	loadSaved(){
 	if (localStorage.getItem('savedGame') === null) {
			form.init();
			form.showMessage("Нет сохраненной игры!");	
  	} else {
		 let savedGame = JSON.parse(localStorage.getItem('savedGame'));
		 controlsPanel.properties.time=savedGame.time;
		 controlsPanel.properties.steps=savedGame.steps;
		 GemPuzzle.instanceProperties.gameField=savedGame.gameField
		 GemPuzzle.properties.size=savedGame.size;
		 GemPuzzle.instanceProperties.isNewGame=false;
		 this.startNewGame();
		}	
	},
    startNewGame(){
		if (GemPuzzle.instanceProperties.isNewGame) {
			GemPuzzle.properties.size=this.elements.fieldSizeSelector.value;		
		}
		Menu.toggleHide();
		controlsPanel.init();
		GemPuzzle.initInstance();
	},
	toggleHide() {
		this.elements.menuElement.classList.toggle("hide_menu");
	}
}

Menu.init();


