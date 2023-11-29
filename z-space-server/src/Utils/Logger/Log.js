const fs = require('./FileSystem.js');

let printFileName = undefined;

module.exports.print = function(...items){
    console.log(...items);
    fileOut(...items);
}

//json을 저렇게 출력하면 데이터가 다 안나와서 별도로 만들었따. 귀찮은데 효과도 없네?
module.exports.printJson = function(json){
    console.log(json);
    fileOut(json);
}



function fileOut(...items){

    if(printFileName === undefined){
        printFileName = 'recent.log';

         //기존 파일이 있으면 제거
        const exists = fs.isExist(printFileName);

        if(exists){
            let retVal = fs.rename(printFileName, 'recent_old.log');
        }
    }

    //
    let text = '';
    items.map(i => text = text.concat(`${toStringJson(i)}, `));
    text = text.concat('\n');

    fs.append(printFileName, text);
}



function toStringJson(obj){

    const strValue = JSON.stringify(obj);

    if(strValue === '{}'){
        return obj.toString();
    }else{
        return strValue;
    }
}


//기껏 파일로거 클래스로 만들어놨더니 글로벌 로깅이 필요하다 거참

//그로벌 로그를 파일 하나에 죄다 집어넣넣
const fileName = undefined;

module.exports.gout = function(text){

    if(fileName === undefined){
        fileName = new Date().getTime() + '.log';
    }

    fs.append(fileName, text);
}


module.exports.roomLogInit = function(roomId){

    const fileName = `GameLog_Room${roomId}.log`;

    if(fs.isExist(fileName)){
        fs.rename(fileName, `GameLog_Room${roomId}_old.log`);
    }
}

Date.prototype.format = function(f) {

    if (!this.valueOf()) {
        return " ";
    }
    
    //
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|fff|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000);
            case "MM": return (d.getMonth() + 1);
            case "dd": return d.getDate();
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours();
            case "hh": return ((h = d.getHours() % 12) ? h : 12);
            case "mm": return d.getMinutes();
            case "ss": return d.getSeconds();
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            case "fff": return d.getMilliseconds();
            default: return $1;
        }
    });
}


module.exports.roomLog = function(roomId, text){

    if(!Number.isInteger(roomId)){
        console.log(`Log.roomLog. invalid roomId ${roomId} / ${text}`);
        return;
    }

    const fileName = `GameLog_Room${roomId}.log`;
    const strTime = new Date().format('yyyy.MM.dd hh:mm:ss:fff');
    fs.append(fileName, `[${strTime}] ${text}\n`);
}