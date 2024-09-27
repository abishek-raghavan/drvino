function Validation(values){
    let error = {}

    if(values.loginLocation === ''){
        error.loginLocation = "Name should not be empty"
    }
    else{
        error.loginLocation = ""
    }
 
    if(values.password === ""){
        error.password = "Passwrod should not be empty"
    }

    else{
        error.password = ""
    }
    return error;
}

export default Validation;