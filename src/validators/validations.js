const mongoose = require('mongoose')

const isValidTitle = (data) => {
    let arr=["Mr","Mrs","Miss"]
    if (typeof data == "string" && data.trim().length !== 0 && arr.includes(data)) return true
    return false
}

const isValidName=(data)=>{
        if(typeof data =="string" && data.trim().length !==0 && data.match(/^[a-z]+$/)) return true
        return false
}  

const isValidPhone=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && data.match(/^[6-9]\d{9}$/)) return true
    return false
}

const isValidEmail=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && data.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) return true
    return false
}

const isValidPassword=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && data.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)) return true
    return false
}

const isValidPincode=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && data.match(/^[1-9][0-9]{5}$/)) return true
    return false
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidISBN=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && data.match(/^[0-9]+$/)) return true
    return false
} 

const isValidreviews=(data)=>{
    if(typeof data =="number" && data.trim().length !==0 && data.match(/^[0-9]+$/)) return true
    return false
}
module.exports={
    isValidTitle,
    isValidName,
    isValidPhone,
    isValidEmail,
    isValidPassword,
    isValidPincode,
    isValid,
    isValidISBN,
    isValidreviews
}