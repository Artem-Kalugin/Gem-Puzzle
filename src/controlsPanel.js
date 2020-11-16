/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
// eslint-disable-next-line import/extensions
import { GemPuzzle } from './GemPuzzle.js';

export const controlsPanel = {
  elements: {
    wrapper: 0,
    timeElement: 0,
    stepsElement: 0,
    saveButton: 0,
    retryButton: 0,
    loseButton: 0,
    soundButton: 0,
    imageCheck: 0,
  },
  properties: {
    time: 0,
    steps: 0,
    timeId: 0,
  },
  init() {
    this.elements.wrapper = document.createElement('div');
    this.elements.saveButton = document.createElement('span');
    this.elements.retryButton = document.createElement('span');
    this.elements.soundButton = document.createElement('span');
    this.elements.timeElement = document.createElement('span');
    this.elements.stepsElement = document.createElement('span');

    this.elements.stepsElement.innerText = this.properties.steps;

    this.elements.saveButton.innerHTML = '<i class="fas fa-save">';
    this.elements.retryButton.innerHTML = '<i class="fas fa-undo">';
    this.elements.soundButton.innerHTML = '<i class="fas fa-volume-up"></i>';

    this.elements.retryButton.addEventListener('click', () => { this.generateNewInstance(); });
    this.elements.saveButton.addEventListener('click', () => { this.saveInstance(); });
    this.elements.soundButton.addEventListener('click', () => { this.toggleSound(); });

    this.elements.wrapper.appendChild(this.elements.timeElement);
    this.elements.wrapper.appendChild(this.elements.retryButton);
    this.elements.wrapper.appendChild(this.elements.saveButton);
    this.elements.wrapper.appendChild(this.elements.soundButton);

    this.elements.wrapper.classList.add('flex');
    if (GemPuzzle.properties.size === 4) {
      this.elements.loseButton = document.createElement('span');
      this.elements.loseButton.innerHTML = '<i class="far fa-flag"></i>';
      this.elements.wrapper.appendChild(this.elements.loseButton);
    }
    this.elements.wrapper.appendChild(this.elements.stepsElement);

    document.body.appendChild(this.elements.wrapper);
    this.countTime();
  },
  toggleSound() {
    GemPuzzle.properties.sounds = !GemPuzzle.properties.sounds;
  },
  saveInstance() {
    const savedGame = {
      time: controlsPanel.properties.time,
      steps: controlsPanel.properties.steps,
      size: GemPuzzle.properties.size,
      gameField: GemPuzzle.instanceProperties.gameField,
      image: GemPuzzle.instanceProperties.image,
      containImage: GemPuzzle.instanceProperties.containImage,
    };
    localStorage.setItem('savedGame', JSON.stringify(savedGame));
  },
  generateNewInstance() {
    GemPuzzle.clearInstance();
    GemPuzzle.initInstance();
  },
  countTime() {
    this.elements.timeElement.innerText = `${controlsPanel.addZero(Math.floor(this.properties.time / 60))}:${controlsPanel.addZero(this.properties.time % 60)}`;
    this.properties.time += 1;
    this.properties.timeId = setTimeout(() => { controlsPanel.countTime(); }, 1000);
  },
  increaseSteps() {
    this.properties.steps += 1;
    this.elements.stepsElement.innerText = this.properties.steps;
  },
  deletePanel() {
    clearTimeout(this.properties.timeId);
    this.elements.wrapper.remove();
  },
  addZero(num) {
    if (num < 10) return `0${num}`;
    return num;
  },
};
