//https://3dmpengines.tistory.com/1971
//이건 파일 입출력 예제 따라했던건데 남겨둠

const fs = require('fs');

module.exports.isExist = (fileName) => {
    return fs.existsSync(fileName);
}

module.exports.create = (fileName) => {

    /**
     * r    읽기모드로 열기. 파일이 없으면 에러발생
     * r+   읽기/쓰기 상태로 열기. 파일이 없으면 에러 발생
     * w    쓰기모드로 열기. 파일이 없으면 생성. 파일이 존재하면 내용을 지우고 씀
     * w+   읽기/쓰기 상태로 열기. 파일이 없으면 생성. 파일이 있으면 내용을 지우고 씀
     * a    추가 쓰기로 열기. 파일이 없으면 만듬
     * a+   추가 읽기/쓰기로 열고 파일이 없으면 만듬
     */
    const descriptor = fs.openSync(fileName, 'w');

    //File descriptor 라는것을 리턴해준다는데 아직 사용법을 모르니까 적용여부를 리턴한다
    if(descriptor){
        return true;
    }else{
        return false;
    }
}

module.exports.rename = (oldName, newName) => {

    if(!this.isExist(oldName)){
        return `file not exists : ${oldName}`;
    }

    //리턴값이 없대서 구분할 방법 없을무
    //근데 에러가 나면 바로 에러를 throw 하기떔에 try catch 처리를 해줌
    try{
        fs.renameSync(oldName, newName);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

module.exports.delete = (fileName) => {

    try{
        fs.unlinkSync(fileName);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}

module.exports.read = (fileName) => {

    //바꿀까 말까
    //fs.readFileSync(fileName, 'utf8');

    fs.readFile(fileName, 'utf8', (err, data) => {
        return {error:err, data:data};
    });
}

module.exports.append = (fileName, dataToAppend) => {

    //바꿀까 말까
    //fs.appendFileSync(fileName, dataToAppend);
    fs.appendFileSync(fileName, dataToAppend);
}