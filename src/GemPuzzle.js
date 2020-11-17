/* eslint-disable import/prefer-default-export */
/* eslint-disable prefer-spread */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import { form } from './form';
import { controlsPanel } from './controlsPanel';
import { Menu } from './Menu';

export const GemPuzzle = {
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
    nullY: 0,
    animate: true,
    animateEvent: 0,
    containImage: false,
    image: 0,
  },
  shuffle() {
    const arr = [];
    for (let i = 0; i < this.properties.size * this.properties.size; i += 1) arr.push(i);
    const shuffled = arr
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    if (this.checkShuffle(shuffled)) {
      for (let j = 0; j < this.properties.size; j += 1) {
        this.instanceProperties.gameField.push(new Array(this.properties.size));
        for (let i = 0; i < this.properties.size; i += 1) {
          this.instanceProperties.gameField[j][i] = shuffled[(j * this.properties.size) + i];
        }
      }
    } else {
      this.shuffle();
    }
  },
  checkShuffle(a) {
    let inv = 0;
    for (let i = 0; i < (this.properties.size * this.properties.size); i += 1) {
      if (a[i] !== 0) {
        for (let j = 0; j < i; j += 1) if (a[j] > a[i]) inv += 1;
      }
      if (a[i] === 0 && !(this.properties.size % 2)) {
        inv += ((this.properties.size + 1 - Math.ceil((i + 1) / this.properties.size)) % 2);
      }
    }
    return ((inv + ((this.properties.size) % 2)) % 2);
  },
  changeGameBoardSize() {
    this.elements.gameBoard.style.height = `${this.elements.gameBoard.offsetWidth}px`;
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((el) => {
      el.style.backgroundSize = `${this.elements.gameBoard.offsetWidth}px`;
    });
  },
  initInstance() {
    this.elements.gameBoard = document.createElement('div');
    this.elements.gameBoard.classList.add('game-board');
    this.elements.gameBoard.style.setProperty('grid-template-rows', `repeat(${this.properties.size}, 1fr)`);
    this.elements.gameBoard.style.setProperty('grid-template-columns', `repeat(${this.properties.size}, 1fr)`);
    Menu.elements.wrapperElement.appendChild(this.elements.gameBoard);
    this.elements.gameBoard.style.height = `${this.elements.gameBoard.offsetWidth}px`;
    window.addEventListener('resize', () => { GemPuzzle.changeGameBoardSize(); });
    if (this.instanceProperties.isNewGame) {
      this.shuffle();
      controlsPanel.properties.time = 0;
      controlsPanel.properties.steps = -1;
      controlsPanel.increaseSteps();
      if (this.instanceProperties.containImage) this.instanceProperties.image = `url(assets/${Math.floor(Math.random() * 150) + 1}.jpg)`;
    }
    for (let j = 0; j < this.properties.size; j += 1) {
      for (let i = 0; i < this.properties.size; i += 1) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.innerText = this.instanceProperties.gameField[j][i];
        block.style.backgroundSize = `${this.elements.gameBoard.offsetWidth}px`;
        block.style.backgroundImage = this.instanceProperties.image;
        block.style.backgroundPosition = `${(100 / (this.properties.size - 1)) * ((block.innerText - 1) % this.properties.size)}% ${(100 / (this.properties.size - 1)) * Math.floor((block.innerText - 1) / this.properties.size)}%`;
        if (this.instanceProperties.containImage) block.style.color = 'rgba(0, 0, 0, 0.0)';
        if (block.innerText === '0') {
          block.classList.toggle('hide');
          this.instanceProperties.nullX = i;
          this.instanceProperties.nullY = j;
        }
        this.elements.gameBoard.appendChild(block.cloneNode(true));
      }
    }
    this.updateInstance();
  },
  deleteEventListeners() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((el) => {
      el.classList.remove('block_active');
      const elClone = el.cloneNode(true);
      el.parentNode.replaceChild(elClone, el);
    });
  },
  updateInstance() {
    this.deleteEventListeners();
    const { nullX } = this.instanceProperties;
    const { nullY } = this.instanceProperties;
    const blocks = document.querySelectorAll('.block');
    const arr = [];
    if (nullX > 0) arr.push(this.instanceProperties.gameField[nullY][nullX - 1]);
    if (nullX < (this.properties.size - 1)) {
      arr.push(this.instanceProperties.gameField[nullY][nullX + 1]);
    }
    if (nullY > 0) arr.push(this.instanceProperties.gameField[nullY - 1][nullX]);
    if (nullY < (this.properties.size - 1)) {
      arr.push(this.instanceProperties.gameField[nullY + 1][nullX]);
    }
    blocks.forEach((el, index) => {
      if (arr.includes(parseInt(el.innerText, 10))) {
        el.classList.add('block_active');
        el.addEventListener('mousedown', () => {
          if (el.classList.contains('block_active')) this.moveElement(el, nullX - (index % this.properties.size), nullY - Math.floor(index / this.properties.size));
        });
      }
    });
    this.checkWin();
  },
  moveElement(element, xOffset, yOffset) {
    const nullEl = document.querySelector('.hide');
    const el = element.cloneNode(true);
    element.classList.toggle('hide');
    el.style.width = `${element.offsetWidth}px`;
    el.style.height = `${element.offsetHeight}px`;
    el.style.position = 'absolute';
    el.style.zIndex = 1000;
    el.style.transitionProperty = 'transform';
    this.elements.gameBoard.appendChild(el);
    el.style.top = `${element.offsetTop - 10}px`;
    el.style.left = `${element.offsetLeft - 10}px`;
    this.properties.animate = false;
    el.addEventListener('mouseup', () => {
      const xNullPos = nullEl.offsetLeft + (nullEl.offsetWidth / 2) + 5;
      const yNullPos = nullEl.offsetTop - (nullEl.offsetWidth / 2) + 5;
      const xBasePos = element.offsetLeft + (element.offsetWidth / 2) + 10;
      const yBasePos = element.offsetTop - (element.offsetHeight / 2) + 10;
      const xElPos = el.offsetLeft + (el.offsetWidth / 2) + 10;
      const yElPos = el.offsetTop - (el.offsetHeight / 2) + 10;
      const offset = (nullEl.offsetWidth / 2) * 1.2;
      if (xElPos < xBasePos + 15 && xElPos > xBasePos - 15
        && yElPos < yBasePos + 15 && yElPos > yBasePos - 15) {
        element.classList.toggle('hide');
        this.animate(element, xOffset, yOffset, true);
        el.remove();
      } else if (xElPos < xNullPos + offset && xElPos > xNullPos - offset
        && yElPos < yNullPos + offset && yElPos > yNullPos - offset) {
        this.animate(element, xOffset, yOffset, false);
        element.classList.toggle('hide');
        el.remove();
      } else {
        element.classList.toggle('hide');
        el.remove();
      }
    });
    function moveAt(e) {
      el.style.left = `${e.pageX - el.offsetWidth / 2}px`;
      el.style.top = `${e.pageY - el.offsetHeight / 2}px`;
    }
    document.onmousemove = (e) => {
      moveAt(e);
    };
  },
  deleteElement(el) {
    el.remove();
  },
  async animate(el, xOffset, yOffset, isAnimated) {
    el.style.transitionProperty = 'transform,left,top';
    if (isAnimated) {
      el.style.position = 'relative';
      el.style.top = `${(el.offsetHeight + 20) * yOffset}px`;
      el.style.left = `${(el.offsetWidth + 20) * xOffset}px`;
    }
    setTimeout(() => {
      el.style.position = 'static';
      el.style.top = 0;
      el.style.left = 0;
      this.swap(el);
    }, this.instanceProperties.animate ? 125 : 0);
  },
  checkWin() {
    const checker = [].concat.apply([], this.instanceProperties.gameField);
    checker.splice(-1, 1);
    const checker2 = checker.join('');
    const checker1 = checker.sort((a, b) => a - b).join('');
    if (checker1 === checker2) {
      form.init();
      this.addRecords();
      form.showMessage(`Ура!Вы решили головоломку за ${controlsPanel.addZero(Math.floor(controlsPanel.properties.time / 60))}:${controlsPanel.addZero(controlsPanel.properties.time % 60)} и ${controlsPanel.properties.steps} ходов`);
      this.clearInstance();
      this.instanceProperties.isNewGame = true;
      Menu.toggleHide();
      controlsPanel.deletePanel();
    }
  },
  addRecords() {
    let records = 0;
    const record = {
      time: controlsPanel.properties.time,
      steps: controlsPanel.properties.steps,
      size: GemPuzzle.properties.size,
    };
    if (localStorage.getItem('records') === null) {
      records = [];
    } else {
      records = JSON.parse(localStorage.getItem('records'));
    }
    records.push(record);
    this.saveRecords(records);
  },
  saveRecords(records) {
    records.sort((a, b) => (a.time > b.time ? 1 : -1));
    while (records.length > 10) records.pop();
    localStorage.setItem('records', JSON.stringify(records));
  },
  swap(el) {
    // alert(el.offsetLeft);

    let x; let
      y;
    for (let i = 0; i < this.properties.size; i += 1) {
      const index = this.instanceProperties.gameField[i].indexOf(parseInt(el.innerText, 10));
      if (index !== -1) {
        x = index;
        y = i;
        break;
      }
    }
    if (this.properties.sounds) this.properties.SoundFile.play();
    const buff = this.instanceProperties.gameField[y][x];
    const nullEl = document.querySelector('.hide');
    const buffBg = nullEl.style.backgroundPosition;
    nullEl.style.backgroundPosition = el.style.backgroundPosition;
    el.style.backgroundPosition = buffBg;
    nullEl.classList.remove('hide');
    el.classList.add('hide');
    nullEl.innerText = buff;
    el.innerText = 0;
    this.instanceProperties.gameField[
      this.instanceProperties.nullY][
      this.instanceProperties.nullX] = buff;
    this.instanceProperties.gameField[y][x] = 0;
    this.instanceProperties.nullX = x;
    this.instanceProperties.nullY = y;
    this.properties.animate = true;
    this.updateInstance();
    controlsPanel.increaseSteps();
  },
  clearInstance() {
    const removing = document.querySelector('.game-board');
    removing.remove();
    this.instanceProperties.isNewGame = true;
    controlsPanel.elements.stepsElement.innerText = 0;
    controlsPanel.elements.timeElement.innerText = '00:00';
    this.instanceProperties.gameField = [];
  },
};
