export const isEmpty = (value) => {

    if(value === null || value === undefined){
        return true;
    }

    //TODO 숫자타입의 0을 비어있다고 봐야하나??
    // if(typeof value !== 'number' && !value){
    //     return true;
    // }

    if(Array.isArray(value)){
        return value.length == 0;
    }
    
    if(typeof value == 'object'){
        return Object.keys(value) == 0;
    }

    value = value.toString();
    return !value || value.length == 0;
}


export const checkHash = (tag) => {
    return tag && window.location.hash?.includes(tag);
}


export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const clamp = (value, min = 0, max = 1) => {
    return Math.max(Math.min(value, max), min);
}

