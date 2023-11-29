import * as THREE from 'three';

export default class ClickEventObserver {

    constructor(camera, canvas) {
        //
        this.rayTargets = [];
        this.camera = camera;
        this.canvas = canvas;
        this.onPressDown = null;
        this.onPressUp = null;
    
        this.onOver = null;
        this.onHit = null;
    
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.enableAll();
        this.viewport = new THREE.Vector2();
        this.clock = new THREE.Clock();
    
        // 마우스 다운 때 충돌된 객체와 시간, 위치
        this.overTarget = null;
        this.downTarget = null;
        this.downTime = 0;
        this.touchId = 0;
        this.downPos = new THREE.Vector2();
        this.tv2 = new THREE.Vector2()
    
        this.isCancelled = false;
        this.raycaster.far = 100;
  
        this.print = {
            i: (...params) => console.log(...params),
            w: (...params) => console.warn(...params),
            e: (...params) => console.error(...params),
        }
  
        this._initEventHandler(canvas);
  
        //
        this.enabled = true;
    }
  
    _initEventHandler(canvas) {

        this.binder = {
            mousedown: e => this._handleDown(e.x, e.y),
            mousemove: e => this._handleMove(e.x, e.y),
            mouseup: e => this._handleUp(e.x, e.y),
            // touchstart: e => this._handleDown(e.touches[0].clientX, e.touches[0].clientY),
            // touchmove: e => this._handleMove(e.touches[0].clientX, e.touches[0].clientY),
            // touchend: e => this._handleUp(0, 0),
            // touchcancel: e => this._handleUp(e.touches[0].clientX, e.touches[0].clientY),
        };
  
        const target = canvas || window;
    
        target.addEventListener('mousedown', this.binder.mousedown);
        target.addEventListener('mousemove', this.binder.mousemove);
        target.addEventListener('mouseup', this.binder.mouseup);
    
        target.addEventListener('mouseout', this.binder.mouseup);
    
        // TODO 여러개 터치될 때에 대한 대비 필요(touchid caching)
        // target.addEventListener('touchstart', this.binder.touchstart, {passive: true});
        // target.addEventListener('touchmove', this.binder.touchmove, {passive: true});
        // target.addEventListener('touchend', this.binder.touchend);
        // target.addEventListener('touchcancel', this.binder.touchcancel);
    }
  
    addTarget(...targets) {
        this.rayTargets.push(...targets);
    }
  
    _handleDown(x, y) {
            
        if (!this.enabled) {
            return;
        }
    
        if (!Array.isArray(this.rayTargets) || !this.rayTargets?.length) {
            this.print.w('not exist raycast targets');
            return;
        }
    
        this.isCancelled = false;
        this._clearDownTargets();
    
        this._setViewport(x, y);
        const result = this.raycaster.intersectObjects(this.rayTargets);
    
        if (result?.length > 0) {
            // chcek invisible
            const hit = result.find(i => i.object.visible && !i.object.isLocked);
    
            if (hit) {
                this.downTarget = hit.object;
                this.downTime = this.clock.getElapsedTime();
                this.downPos.set(x, y);
        
                this.onPressDown && this.onPressDown(this.downTarget, x, y);
            }
        }
    }
  
    _handleMove(x, y) {

        if (!this.enabled) {
            return;
        }

        if (this.onOver) {
            
            this._setViewport(x, y);
            const result = this.raycaster.intersectObjects(this.rayTargets);

            if (result.length > 0) {
            const newOverTarget = result[0].object;

            if (this.overTarget == null || this.overTarget !== newOverTarget) {
                this.overTarget = newOverTarget;
                this.onOver && this.onOver('mouseover', newOverTarget);
            }

            //
            if (this.downTarget !== newOverTarget) {
                this.isCancelled = true;
                this.onPressUp && this.onPressUp(this.downTarget, this.isCancelled);
                // this._clearDownTargets();
            }
            } else if (this.overTarget) {
            this.onOver && this.onOver('mouseout', this.overTarget);
            this.overTarget = null;
            }
        }

        // 다운만 체크
        if (!this.downTarget || this.isCancelled) {
            return;
        }
  
        //
        this._setViewport(x, y);
        const result = this.raycaster.intersectObject(this.downTarget);  // TODO optionalTarget
    
        if (result.length > 0) {

            this.tv2.set(x, y);
            const distance = this.downPos.distanceTo(this.tv2);
    
            if (distance > 50) {
                this.isCancelled = true;
                this.onPressUp && this.onPressUp(this.downTarget, this.isCancelled);
            }

        } else {

            this.isCancelled = true;
            this.onPressUp && this.onPressUp(this.downTarget, this.isCancelled);
            // this._clearDownTargets();
        }
    }
  
    _handleUp(x, y) {
        if (!this.enabled) {
            return;
        }
    
        if (!this.downTarget) {
            return;
        }
    
        this.onPressUp && this.onPressUp(this.downTarget, false);
    
        if (this.isCancelled) {
            this._clearDownTargets();
            return;
        }
  
        //
        this._setViewport(x, y);
        const result = this.raycaster.intersectObject(this.downTarget);
    
        if (result?.length > 0) {
            this.onHit && this.onHit(result[0].object, result[0].distance, result[0].point, result[0].uv);
        }
    
        this._clearDownTargets();
    }
  
    _setViewport(x, y) {

        this.viewport.x = (x / window.innerWidth) * 2 - 1;
        this.viewport.y = -(y / window.innerHeight) * 2 + 1;
    
        if (this.camera?.isCamera) {
            this.raycaster.setFromCamera(this.viewport, this.camera);
        } else {
            this.print.w('not a camera instance');
        }
    }
  
    _clearDownTargets() {
        this.downTarget = null;
        this.downTime = 0;
    }
  
    setMaxDistance(distance) {
        this.raycaster.far = distance;
    }
  
    dispose() {
      
        const target = canvas || window;

        target.removeEventListener('mousedown', this.binder.mousedown);
        target.removeEventListener('mousemove', this.binder.mousemove);
        target.removeEventListener('mouseup', this.binder.mouseup);
  
        target.removeEventListener('mouseout', this.binder.mouseup)
  
        target.removeEventListener('touchstart', this.binder.touchstart)
        target.removeEventListener('touchmove', this.binder.touchmove)
        target.removeEventListener('touchend', this.binder.touchend)
    
        target.removeEventListener('touchcancel', this.binder.touchcancel)
  
        this.binder = null
    
        //
        this.rayTargets = null
        this.camera = null
        this.onPressDown = null
        this.onPressUp = null
    
        this.onOver = null
        this.onHit = null
    
        this.raycaster = null
        this.viewport = null
        this.clock = null
    
        this.overTarget = null
        this.downTarget = null
        this.downPos = null
        this.tv2 = null
    
        this.canvas = null
        this.enabled = false
    }
  }
  