/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
import { GemPuzzle } from './GemPuzzle.js';
import { form } from './form.js';
import { controlsPanel } from './controlsPanel.js';

export const Menu = {
  elements: {
    wrapperElement: 0,
    menuElement: 0,
    newGameButton: 0,
    savedGameButton: 0,
    recordsButton: 0,
    fieldSizeSelector: 0,
    inputElement: 0,
  },
  init() {
    this.elements.wrapperElement = document.createElement('div');
    this.elements.menuElement = document.createElement('div');
    this.elements.newGameButton = document.createElement('span');
    this.elements.savedGameButton = document.createElement('span');
    this.elements.recordsButton = document.createElement('span');
    this.elements.fieldSizeSelector = document.createElement('select');
    const imageCheck = document.createElement('label');
    this.elements.inputElement = document.createElement('input');
    this.elements.inputElement.type = 'checkbox';
    imageCheck.innerText = 'IMAGE';
    imageCheck.appendChild(this.elements.inputElement);

    // Setup main elements
    this.elements.wrapperElement.classList.add('wrapper');
    this.elements.newGameButton.innerText = 'New Game';

    this.elements.newGameButton.addEventListener('click', () => { this.startNewGame(); });
    this.elements.savedGameButton.addEventListener('click', () => { this.loadSaved(); });
    this.elements.recordsButton.addEventListener('click', () => { this.showRecords(); });

    this.elements.savedGameButton.innerText = 'Saved Game';
    this.elements.recordsButton.innerText = 'Records';
    this.elements.menuElement.classList.add('menu');
    this.elements.fieldSizeSelector.setAttribute('size', '1');
    const option = document.createElement('option');
    option.innerText = '3x3';
    option.setAttribute('value', '3');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    option.innerText = '4x4';
    option.setAttribute('value', '4');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    option.innerText = '5x5';
    option.setAttribute('value', '5');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    option.innerText = '6x6';
    option.setAttribute('value', '6');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    option.innerText = '7x7';
    option.setAttribute('value', '7');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    option.innerText = '8x8';
    option.setAttribute('value', '8');
    this.elements.fieldSizeSelector.appendChild(option.cloneNode(true));
    this.elements.fieldSizeSelector.value = '4';

    // Add to DOM
    this.elements.menuElement.appendChild(this.elements.newGameButton);
    this.elements.menuElement.appendChild(this.elements.savedGameButton);
    this.elements.menuElement.appendChild(this.elements.recordsButton);
    this.elements.menuElement.appendChild(this.elements.fieldSizeSelector);
    this.elements.menuElement.appendChild(imageCheck);
    this.elements.wrapperElement.appendChild(this.elements.menuElement);
    document.body.appendChild(this.elements.wrapperElement);
  },
  showRecords() {
    form.init();
    form.addRecordsToForm();
    form.showForm();
  },
  loadSaved() {
    if (localStorage.getItem('savedGame') === null) {
      form.init();
      form.showMessage('Нет сохраненной игры!');
    } else {
      const savedGame = JSON.parse(localStorage.getItem('savedGame'));
      controlsPanel.properties.time = savedGame.time;
      controlsPanel.properties.steps = savedGame.steps;
      GemPuzzle.instanceProperties.gameField = savedGame.gameField;
      GemPuzzle.properties.size = savedGame.size;
      GemPuzzle.instanceProperties.isNewGame = false;
      GemPuzzle.instanceProperties.image = savedGame.image;
      GemPuzzle.instanceProperties.containImage = savedGame.containImage;
      this.startNewGame();
    }
  },
  startNewGame() {
    if (GemPuzzle.instanceProperties.isNewGame) {
      GemPuzzle.properties.size = this.elements.fieldSizeSelector.value;
    }
    GemPuzzle.instanceProperties.containImage = this.elements.inputElement.checked;
    Menu.toggleHide();
    controlsPanel.init();
    GemPuzzle.initInstance();
  },
  toggleHide() {
    this.elements.menuElement.classList.toggle('hide_menu');
  },
};
