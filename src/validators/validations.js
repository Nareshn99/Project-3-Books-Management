const mongoose = require('mongoose')

const isValidTitle = (data) => {
    if (typeof data == "string" && data.trim().length !== 0 && data.match(/Mr|Mrs|Miss/)) return true
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

module.exports={
    isValidTitle,isValidName,isValidPhone,isValidEmail,isValidPassword
}