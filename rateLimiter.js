

const { request } = require('express');
const moment = require('moment');

const requestMap = new Map();
const MAX_REQUESTS = 10;
const WINDOW_TIME = 10;



 const rateLimiter = (req,res,next) => {
    
    if(!(requestMap.has(req.ip))){
     requestMap.set(req.ip,{
        time:moment(),
        counter:0
     
    });
     return next();

}
else {
    var userRequest = requestMap.get(req.ip);
    var userTime = userRequest.time;
    var userCounter = userRequest.counter;
    if(userTime.unix()<(moment().unix()-WINDOW_TIME))
    {
        requestMap.set(req.ip,{
            time:moment(),
            counter:0
         
        });
         return next();
    }

    else{
        if(userCounter>=10){
            res.send("Too many requests too quickly");
            return;
        }
        else{
            requestMap.set(req.ip,{
                time: userTime,
                counter: userCounter+1
             
            });
            next();
        }

    }


}     
 

    




next();
}
module.exports= rateLimiter;
