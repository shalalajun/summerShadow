import {EventEmitter} from '../core';

/**
 * 키입력 이벤트 처리
 * trigger : keyevent
 */
export default class KeyInput extends EventEmitter{
    
    constructor(){
        super();

        this.binder = this.onKeyEvent.bind(this);
        window.addEventListener('keydown', this.binder);
        window.addEventListener('keyup', this.binder);
    }


    onKeyEvent(e){
        this.trigger('keyevent', e);
    }


    dispose(){
        super.dispose();

        window.removeEventListener('keydown', this.binder);
        window.removeEventListener('keyup', this.binder);
        this.binder = null;
    }
}