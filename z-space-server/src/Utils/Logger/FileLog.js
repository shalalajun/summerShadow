//https://3dmpengines.tistory.com/1971
//클래스 형식으로 만들어보자

const fs = require('./FileSystem.js');

function FileLog(path){
    this.filePath = path;
}

const proto = FileLog.prototype;


proto.rename = function (newName) {

    if(!fs.isExist(this.filePath)){
        return `file not exists : ${this.filePath}`;
    }

    return fs.rename(this.filePath, newName);
}

proto.delete = function () {

    if(!fs.isExist(this.filePath)){
        return `file not exists : ${this.filePath}`;
    }

    return fs.delete(this.filePath);
}

proto.append = function (dataToAppend) {
    return fs.append(this.filePath, dataToAppend);
}

proto.appendLine = function(dataToAppend) {
    return fs.append(this.filePath, dataToAppend + '\n');
}

module.exports = FileLog;