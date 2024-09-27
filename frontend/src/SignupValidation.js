function Validation(values){
    let error = {}


    if(values.name === ""){
        error.name="Name should not be empty"
    }
    
    else{
        error.name=""
    }

    if(values.category === ""){
        error.category="Name should not be empty"
    }
    
    else{
        error.category=""
    }
    if(values.product === ""){
        error.product="Name should not be empty"
    }
    
    else{
        error.product=""
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