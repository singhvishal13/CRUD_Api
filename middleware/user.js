const jwt = require('jsonwebtoken');
const mongoUser = require('../models/mongoSchema')

function corsHandle(req,res,next){
    res.header("Access-Control-Allow-Origin","*");      //allow only specific domain to access my api here it is to all
    res.header(
        "Access-Control-Allow-Origin",
        "Origin, X-Requested-with, Content-Type, Accept, Authorization"
        );  //type of header to accept
        if(req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE');
            return res.status(200).json({});
        }
        next();
};

function error400(req,res,next){
    const error = new Error('Not found');
    error.status = 400;
    next(error);
}

//to handle any error apart from  missing routes
function error500(error, req, res, next) {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
};

async function authorize(req, res, next){
    try{
        const mobileNo = req.params.key;
        const mongouser = await mongoUser.findOne({mobile:mobileNo});
        if (mongouser.tokenSave == undefined) {
            return res.status(401).json({ message: 'user not login' });
        }
        const token = req.headers.authorization.split(' ')[1];
        if(mongouser.tokenSave == token){
            const decodedToken =  jwt.verify(token, process.env.JWT_KEY);
            req.userData = decodedToken;
            next();
        }else{
            return res.status(401).json({ message: 'invalid authentication' });
        }
    }catch(err){
        return res.status(500).json({
            message: "Invalid or expired token provided!",
            error:err
        });
    }
}

module.exports = {
    corsHandle: corsHandle,
    error400:   error400,
    error500:   error500,
    authorize: authorize,
    // indivAuthorize: indivAuthorize
}