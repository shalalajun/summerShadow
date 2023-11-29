import Project from './threejs/Project';
import './style.css';
import {print} from './threejs/utils/print';
import EventEmitter from './threejs/core/EventEmitter';

import './threejs/utils/prototypes';

//global settings
//window.print = print;

//const webGL = Project.getInst(document.querySelector('canvas.webgl'));
const webGL = new Project(document.querySelector('canvas.webgl'));
window.threejs = webGL;
