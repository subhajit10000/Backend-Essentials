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
