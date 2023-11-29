import EventEmitter from './EventEmitter';

/**
 * 화면 리사이즈 이벤트 처리
 * trigger : resize
 */
export default class Sizes extends EventEmitter{
    
    constructor(){
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        //Resize event
        this.binder = this.onResize.bind(this);
        window.addEventListener('resize', this.binder);
    }


    onResize(){

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.trigger('resize');
    }
    
    dispose(){
        super.dispose();

        window.removeEventListener('resize', this.binder);
        this.binder = null;
    }
}