import EventEmitter from './EventEmitter';

/**
 * 월드 내 시간, requestAnimationFrame 처리
 */
export default class Time extends EventEmitter {

    constructor() {
        super();

        //
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.elapsedScalar = 0;
        this.delta = 16;
        this.deltaScalar = this.delta * 0.001;

        this.binder = {
            frame:this.onTick.bind(this),
            focus:this.onFocus.bind(this),
        } 

        window.requestAnimationFrame(this.binder.frame);

        //탭을 넘어갔다가 오랜만에 돌아오면 deltaScalar값이 누적되어 한번에 큰 값이 넘어와 죄다 망가지는 현상 발생.
        //해당내용 수정을 위해 포커스가 돌아왔을때 current 값을 업데이트 하도록 처리
        window.addEventListener('focus', this.binder.focus);
        window.addEventListener('visibilitychange', this.binder.focus);
    }


    onTick(){
        
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.deltaScalar = this.delta * 0.001;
        this.current = currentTime;
        this.elapsed = this.current - this.start;
        this.elapsedScalar = this.elapsed * 0.001;

        this.trigger('tick');

        this.binder?.frame && window.requestAnimationFrame(this.binder.frame);
    }


    onFocus(e){
        this.current = Date.now();
    }


    dispose(){
        super.dispose();

        //window.removeEventListener('tick', this.binder.frame);
        window.removeEventListener('focus', this.binder.focus);
        window.removeEventListener('visibilitychange', this.binder.focus);
        this.binder = null;
    }
}