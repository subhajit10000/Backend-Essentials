// server.js
//----------------
require("dotenv").config();
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})





//app.js
//-----------
const express = require("express");
const authRouter = require("./routes/auth.routes.js");
const userRouter = require("./routes/user.routes.js");
const app = express();
app.use(express.json());
// Base  url 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
module.exports = app;





//auth.routes.js
//----------------------
const express = require("express");
const { hello, register, login } = require("../controllers/auth.controller.js");
const router = express.Router();
router.get("/hi", hello)
router.post("/register", register)
router.post("/login", login);
module.exports = router;





//user.routes.js
//-----------------
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware.js");
const { profile } = require("../controllers/user.controller.js");
router.get("/profile", authMiddleware, profile);
module.exports = router;





//auth.middleware.js
//-------------------
const { verifyToken } = require("../utils/jwt.util.js");
const authMiddleware = (req, res, next) => {
    console.log(req.headers['authorization']);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Token missing"
        })
    }
    // bearer sgfifiugruifgriufrugfsufgoiuwrtwr4ry824ry48rweiurgkufgk
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token); // {token-> user.id , user.email }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        })
    }
}
module.exports = authMiddleware;







//user.middleware.js
//------------------






//auh.controller.js
//---------------------
const { helloService, registerUser, loginUser } = require('../services/auth.service.js');

const hello = (req, res) => {

    const data = helloService();
    res.send(data);
}

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser(name, email, password);

        res.status(201).json({
            "success": true,
            "data": user
        })

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const loggedInUser = await loginUser(email, password);

        res.status(200).json({
            success: true,
            loggedInUser
        })

    } catch (error) {
        next(error);
    }
}

module.exports = { hello, register, login }









//user.controller.js
//-------------------------
const { getUserById, getAllUsers, updatedUser, deleteUser } = require("../services/user.service.js")


const profile = async (req, res, next) => {
    console.log(req.user.id);

    const user = await getUserById(req.user.id);
    res.json({
        success: true,
        data: user
    })
}

const getUsers = async (req,res)=>{
    const users = await getAllUsers();
    if(!users){
        res.status(400).json({
            success:false,
            message: "user not found"
        })
    }

    res.status(200).json({
        success:true,
        data:users
    })
}
const updateProfile = async (req, res, next) => {
    try {
        const updUser = await updatedUser(req.user.id, req.body);
        if (!updUser) {
            res.status(400).json({
                success: false,
                message: "user not updated!"
            })
        }


        res.status(200).json({
            success: true,
            data: updUser
        })


    } catch (error) {
        new Error(error);
    }
}

const removeProfile = async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully."
    })
  } catch (err) {
    next(err);
  }
}
module.exports = { profile, getUsers, updateProfile, removeProfile }











//auth.service.js
//---------------------
const users = require("../data/users.js");
const {
    hashedPassword, comparePassword
} = require("../utils/hash.util.js");

const {
    generateToken, verifyToken
} = require("../utils/jwt.util.js");

const helloService = () => {
    return "Hello Hi, tata by by";
}


const registerUser = async (name, email, password) => {
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        throw new Error("User already exists.")
    }

    // hashing the password.
    const pass = await hashedPassword(password);
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: pass
    }

    users.push(newUser);

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
    }
};

const loginUser = async (email, password) => {

    // email, password
    // 1 : email => .user doesnt exist
    const user = users.find((user) => user.email === email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    // 2 : password wrong
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    // 3 : token generate 
    const token = await generateToken({
        id: user.id,
        email: user.email
    })
    // 4 : response send 
    return token;
}
module.exports = { helloService, registerUser, loginUser }











//user.service.js
//------------------
const users = require("../data/users.js");
const getUserById = (id) => {
    return users.find((user) => user.id === id);
}
module.exports = { getUserById };






//hash.util.js
//---------------
const bcrypt = require("bcryptjs");
// hashing abc => ksf87r4r2rirgweifgeweig
const hashedPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}
// compare = > convert your password to hash and then compare both the hashed pass
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashedPassword, comparePassword
}






//jwt.util.js
//---------------
const jwt = require("jsonwebtoken");


const secret = process.env.JWT_SECRET;
// generate token
const generateToken = (payload) => {
    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: "1h"
        }
    )
}
// verify token
const verifyToken = (token) => {
    return jwt.verify(
        token,
        secret
    )
}
module.exports = {
    generateToken, verifyToken
}








//.env
//---------
PORT=5000
JWT_SECRET=SOMETHINGSECRET





//data/users.js
//-----------------
const users = [];
module.exports = users;
