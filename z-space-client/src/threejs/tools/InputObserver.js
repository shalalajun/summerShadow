import * as THREE from 'three';
import EventEmitter from '../core/EventEmitter';

const event = {
    down:'down',
    press:'press',
    up:'up',
};

export default class InputObserver extends EventEmitter {

    constructor(camera, canvas){
        super();

        this.camera = camera;
        this.dom = canvas ? canvas : window;

        //
        this.isPressed = false;
        this.viewport = new THREE.Vector2();

        //
        this._initEventListener();
    }


    _initEventListener(){
        
        this.binder = {
            mousedown: e => this._handleDown(e.x, e.y),
            mousemove: e => this._handleMove(e.x, e.y),
            mouseup: e => this._handleUp(e.x, e.y),
            
            touchstart: e => this._handleDown(e.touches[0].clientX, e.touches[0].clientY),
            touchmove: e => this._handleMove(e.touches[0].clientX, e.touches[0].clientY),
            touchend: e => this._handleUp(0, 0),

            touchcancel: e => this._handleUp(e.touches[0].clientX, e.touches[0].clientY)
        };
  
        this.dom.addEventListener('mousedown', this.binder.mousedown);
        this.dom.addEventListener('mousemove', this.binder.mousemove);
        this.dom.addEventListener('mouseup', this.binder.mouseup);    
        this.dom.addEventListener('mouseout', this.binder.mouseup);

        this.dom.addEventListener('touchstart', this.binder.touchstart, { passive: true });
        this.dom.addEventListener('touchmove', this.binder.touchmove, { passive: true });
        this.dom.addEventListener('touchend', this.binder.touchend);
        this.dom.addEventListener('touchcancel', this.binder.touchcancel);
    }

    _handleDown(x, y){
        print('_handleDown', x, y);
        this.isPressed = true;
        this._setViewport(x, y);
        this.trigger(event.down, [this.viewport]);


    }

    _handleMove(x, y){
        if(this.isPressed){
            print('_handleMove', x, y);
            this._setViewport(x, y);
        }
    }

    _handleUp(x, y){
        print('_handleUp', x, y);
        this.isPressed = false;
        this.trigger(event.up);
    }

    _setViewport(x, y){
        this.viewport.x = (x / window.innerWidth) * 2 - 1;
        this.viewport.y = -(y / window.innerHeight) * 2 + 1;
    }

    dispose(){

        //
        this.dom.removeEventListener('mousedown', this.binder.mousedown);
        this.dom.removeEventListener('mousemove', this.binder.mousemove);
        this.dom.removeEventListener('mouseup', this.binder.mouseup);  
        this.dom.removeEventListener('mouseout', this.binder.mouseup);

        this.dom.removeEventListener('touchstart', this.binder.touchstart);
        this.dom.removeEventListener('touchmove', this.binder.touchmove);
        this.dom.removeEventListener('touchend', this.binder.touchend);
        this.dom.removeEventListener('touchcancel', this.binder.touchcancel);

        //
        this.binder = null;
        this.camera = null;
        this.dom = null;

        this.viewport = null;
    }

    onUpdate(time){

        if(this.isPressed){
            this.trigger(event.press, [this.viewport]);
        }
    }
}

function print(...params) {
    //console.log('[InputObserver.js]', ...params);
}

function printw(...params){
    console.warn('[InputObserver.js]', ...params);
}