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
const { getUserById } = require("../services/user.service.js")
const profile = async (req, res, next) => {
    console.log(req.user.id);

    const user = await getUserById(req.user.id);
    res.json({
        success: true,
        data: user
    })
}
module.exports = { profile }
