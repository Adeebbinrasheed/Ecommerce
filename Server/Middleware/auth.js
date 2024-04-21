const User = require("../Model/User");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken")




exports.isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new ErrorHandler("please Login to continue",401))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)

    req.user=await User.findById(decoded.id);
    next()
})