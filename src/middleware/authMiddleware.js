const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv/config');

const protectRoute = async (req, res, next) => {
   try {
    const authHeader = req.header("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Unauthorized Access"});
    }
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user= await User.findById(decoded.id).select("-password");
    if(!user){
        return res.status(401).json({message: "Unauthorized Access"});
    }
    req.user = user;
    next();
   } catch (error) {
    console.log("Error in authentication", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
   }
};

module.exports = protectRoute;
