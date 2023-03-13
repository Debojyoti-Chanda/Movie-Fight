const func1 = (callback)=>{
    console.log("1st Function");
    // console.log(arguments);
    return (a,b,c)=>{
        callback(a,b,c);
    }
    
}
const func2 = (num , num2)=>{
    console.log("Second Function ",num,num2);
}
func1(function (20,30,40) {
    func2({a:1,b:2},10);
})

// callback function
// function tryMe(param1, param2, param3) {
//     alert(param1 + " and " + param2 + " " + param3);
//   }
  
//   // callback executer 
//   function callbackTester(callback) {
//     //this is the more obivous scenario as we use callback function
//     //only when we have some missing value
//     //get this data from ajax or compute
//     var extraParam = "this data was missing";
  
//     //call the callback when we have the data
//     callback(extraParam);
//   }
  
//   // test function
//   callbackTester(function(k) {
//     tryMe("hello", "goodbye", k);
//   });



function tryMe (param1, param2) {
    alert (param1 + " and " + param2);
}
function callbackTester (callback) {
    callback();
}
callbackTester(tryMe.bind(null, "hello", "goodbye"));