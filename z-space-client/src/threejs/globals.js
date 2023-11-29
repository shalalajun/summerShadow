//개발모드 토글. 현재는 소켓주소 분기만 있음
const devMode = false;

//서버 없이 동작하게 만들지 여부(개발시 귀찮아서)
const IGNORE_SERVER = false;


const ROOT_PATH = './';

const SOCKET_URL = devMode ? 
    'http://localhost:8100' : 
    'http://mingming.me:8100';

const physics = {
    gravity:-9.8
}

export {
    ROOT_PATH, SOCKET_URL, IGNORE_SERVER, physics
}