import jwt from "jsonwebtoken";

const generateToken = (id, res) =>{
    const token = jwt.sign({id}, process.env.JWT_SEC, {
        expiresIn: "15d",
        });
    
        //token generated & now saving in cookie: 
        res.cookie("token", token, { //setting token in "token" variable 
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true ,
        sameSite: "strict"
        });
    }

    //cookie stored in token 

    export default generateToken