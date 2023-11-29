
//서버-클라이언트간 커스텀 이벤트
const netEvent = {
    c2s:{
        join:'c2s_join',
        updateTransform:'c2s_updateTransform',
    },

    s2c:{
        join:'s2c_join',
        leave:'s2c_leave',
        updateAllPlayer:'s2c_updateAllPlayer',
    }
};

//NetworkManager-기타 모듈간 이벤트 콜백
const netCallback = {
    connectionChanged:'onConnectionChanged',
};

export {
    netEvent, netCallback
};