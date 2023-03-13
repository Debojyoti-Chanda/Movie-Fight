const debounce = (func , delay)=>{
    let timeOutId;
    return (...args)=>{
    // console.log(args);
        if(timeOutId){             
            clearTimeout(timeOutId);
        };
        timeOutId = setTimeout(()=>{    
              func.apply(null,args); //func(...args); 
        },delay);
    };
};