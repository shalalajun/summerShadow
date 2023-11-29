
const TAG = '[db.js]';

const {User} = require('./User.js');

class Database {

    constructor(){
        this.list = [];
    }

    /**
     * 유저 추가
     * @param {string} socketId 
     * @param {int} characterIdx 
     * @param {Array} transform [px, py, px, dx, dy, dz]
     * @returns 유저가 새로 추가되었을때만 User를 리턴
     */
    init(socketId, characterIdx, transform){
        
        let user = this.list.find(i => i.info.socketId == socketId);

        if(user){
            //user.characterIdx = characterIdx;
            user.updateTransform(...transform);
            return null;
        }else{
            user = new User(socketId, characterIdx);
            this.list.push(user);
            user.updateTransform(...transform);
            return user;
        }
    }

    /**
     * 유저 추가
     * @param {string} socketId 
     * @param {bool} isMove
     * @param {Array} transform [px, py, px, dx, dy, dz]
     * @returns 유저가 새로 추가되었을때만 User를 리턴
     */
    update(socketId, isMove, transform){
        
        let user = this.list.find(i => i.info.socketId == socketId);

        if(user){
            user.setMoveState(isMove);
            user.updateTransform(...transform);
            return null;
        }else{
            user = new User(socketId);
            this.list.push(user);
            user.setMoveState(isMove);
            user.updateTransform(...transform);
            return user;
        }
    }

    remove(socketId){

        const idx = this.list.findIndex(i => i.info.socketId == socketId);

        if(idx < 0){
            return null;
        }

        const item = this.list[idx];
        this.list.splice(idx, 1);

        return item;
    }
}

module.exports = Database;