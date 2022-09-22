const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phoneRegex=/^[6-9]\d{9}$/
const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
const pincodeRegex=/^[1-9][0-9]{5}$/
const ISBNregex=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

const isValidTitle = (data) => {
    let arr=["Mr","Mrs","Miss"]
    if (typeof data == "string" && data.trim().length !== 0 && arr.includes(data.trim())) return true
    return false
}

const isValidName=(data)=>{
        if(typeof data == "string" && data.trim().length !==0 && /^[a-z A-Z]+$/.test(data.trim())) return true
        return false
}  

const isValidPhone=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && phoneRegex.test(data.trim())) return true
    return false
}

const isValidEmail=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && emailRegex.test(data.trim())) return true
    return false
}

const isValidPassword=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && passwordRegex.test(data.trim())) return true
    return false
}

const isValidPincode=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && pincodeRegex.test(data.trim())) return true
    return false
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidISBN=(data)=>{
    if(typeof data =="string" && data.trim().length !==0 && ISBNregex.test(data.trim())) return true
    return false
} 

const isValidreviews=(data)=>{
    if(typeof data =="number" && data.trim().length !==0 && /^[0-9]+$/.test(data)) return true
    return false
}

const isValidrating=(data)=>{
    if(typeof data =="number" && data.trim().length !==0 && /^([1-5])$/.test(data)) return true
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
    isValidreviews,
    isValidrating
}