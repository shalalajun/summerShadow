import {Vector3} from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule';

Capsule.prototype.toString = function(p=4){
    const strStart = `start={x=${this.start.x.toFixed(p)}, y=${this.start.y.toFixed(p)}, z=${this.start.z.toFixed(p)}}`;
    const strEnd = `end={x=${this.end.x.toFixed(p)}, y=${this.end.y.toFixed(p)}, z=${this.end.z.toFixed(p)}}`;
    return `[Capsule]\n${strStart}\n${strEnd}\nradius=${this.radius.toFixed(p)}`;
}

Vector3.prototype.toString = function(p=4){
    return `[Vector3]\n{x=${this.x.toFixed(p)}, y=${this.y.toFixed(p)}, z=${this.z.toFixed(p)}`;
}