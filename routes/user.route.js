import express from "express";
import { deleteUser, followController, getMyProfile, getUserProfile, signInController, updatePasswordController, userController } from "../controllers/user.controller.js";
import { isAuthenticate } from "../middleware/verifyJwt.js";

const userRoute = express.Router();

userRoute.route("/register/").post(userController)
userRoute.route("/login").post(signInController)
userRoute.route("/followUnfollow/:id").get(isAuthenticate, followController)
userRoute.route("/changePassword").put(isAuthenticate, updatePasswordController)
userRoute.route("/deletUser").delete(isAuthenticate, deleteUser)
userRoute.route("/getuserDetail/:id").get(isAuthenticate,getUserProfile)
userRoute.route("/profile").get(isAuthenticate,getMyProfile)
export { userRoute };