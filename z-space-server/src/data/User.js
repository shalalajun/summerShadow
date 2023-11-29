class User {

    constructor(socketId, idx = 0){

        this.info = new UserInfo(socketId);
        this.characterIdx = idx;
        this.lastUpdateTime = 0;
    }

    setMoveState(isMove){
        this.info.isMove = isMove;
    }

    updateTransform(px, py, pz, dx, dy, dz){
        this.info.setTransform(px, py, pz, dx, dy, dz);
        this.lastUpdateTime = new Date().getTime() / 1000;
    }

    getAllData(){
        return {
            socketId:this.info.socketId,
            idx:this.characterIdx,
            px:this.info.px,
            py:this.info.py,
            pz:this.info.pz,
            dx:this.info.dx,
            dy:this.info.dy,
            dz:this.info.dz,
            isMove:this.info.isMove,
        };
    }

    toString(){
        return `[UserInfo.js] ${JSON.stringify(this.info)}, lastUpdateTime=${this.lastUpdateTime}`;
    }
}

class UserInfo {

    constructor(socketId){
        this.socketId = socketId;
        this.action = null;
        this.px = 0;
        this.py = 0;
        this.pz = 0;
        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
    }

    setTransform(px, py, pz, dx, dy, dz){
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
    }
}

module.exports = {User, UserInfo};