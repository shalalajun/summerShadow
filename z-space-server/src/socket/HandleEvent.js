const TAG = '[eventHandler.js]';
const Database = require('../data/Database');

const event = {
    
    system:{
        disconnect:'disconnect',
    },

    c2s:{
        join:'c2s_join',
        updateTransform:'c2s_updateTransform',
    },
    
    s2c:{
        join:'s2c_join',
        leave:'s2c_leave',
        updateAllPlayer:'s2c_updateAllPlayer',
    }
}

class HandleEvent {

    constructor(io){

        this.io = io;
        this.db = new Database();
        
        io.on('connection', this.onConnection.bind(this));

        this._initLoopers();
    }

    _initLoopers(){

        //0.1초마다 포지션 업데이트
        setInterval(() => {
            
            const resp = {
                list: this.db.list,
            };

            //print('updateAllPlayer', JSON.stringify(resp));
            this.io.emit(event.s2c.updateAllPlayer, resp);

        }, 0.1 * 1000);
    }

    onConnection(socket){
        print('connection', socket.id, socket.data);

        const {io, db} = this;

        /*
            reqData = {
                idx:idx(int) 캐릭터 인덱스
                trf:[px, py, pz, dx, dy, dz], 위치 및 회전값
            }
        */
        socket.on(event.c2s.join, function(reqData, cb){
            print(event.c2s.join, socket.id, reqData);
    
            const addedUser = db.init(socket.id, reqData.idx, reqData.trf);
    
            const resp = {
                result:'ok',
                socketId:socket.id,
                list:[]
            };

            db.list.forEach(user => {
                resp.list.push(user.getAllData());
            });
    
            cb && cb(resp);
    
            if(addedUser){
                const data = addedUser.getAllData();
                socket.broadcast.emit(event.s2c.join, data);
            }
        });
    
        /*
            reqData = {
                isMove:(bool) 사용자가 조작중인지(MyCat.isMove)
                trf:[
                    px, py, pz (float) 위치값
                    dx, dy, dz (float) 회전값
                ]
            }
        */
        socket.on(event.c2s.updateTransform, function(reqData, cb){
            //print(event.c2s.updateTransform, socket.id, reqData.isMove);
    
            const addedUser = db.update(socket.id, reqData.isMove, reqData.trf);
    
            const resp = {
                result:'ok',
                socketId:socket.id,
            }
    
            cb && cb(resp);
    
            if(addedUser){
                const data = addedUser.getAllData();
                socket.broadcast.emit(event.s2c.join, data);
            }
        });
    
        socket.on(event.system.disconnect, function() {
            print(event.system.disconnect, socket.id);
    
            const removedUser = db.remove(socket.id);

            if(removedUser){
                socket.broadcast.emit(event.s2c.leave, removedUser.info);
            }
        });
    }
}

function print(...params){
    console.log(TAG, ...params);
}

module.exports = HandleEvent;