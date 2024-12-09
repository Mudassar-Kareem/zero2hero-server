const express = require("express");
const { createUser, userLogin, loadUser, logoutUser, getAllUser } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

const userRouter = express.Router();


userRouter.post("/create", createUser);
userRouter.post("/login", userLogin);
userRouter.get("/me",isAuthenticated, loadUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/getUsers",getAllUser);

module.exports = userRouter;