import express from "express";
import { commentCreate, commentDelete, createPostController, deletePostController, getFollowingUserPost, likeUnlikeController, myPostCommentDelete, updateCaptioncontroller } from "../controllers/post.controller.js";
import { isAuthenticate } from "../middleware/verifyJwt.js";

const postRoute = express()

postRoute.route("/post").post(isAuthenticate, createPostController)
postRoute.route("/post").get(isAuthenticate,getFollowingUserPost)
postRoute.route("/post/:id").delete(isAuthenticate, deletePostController)
postRoute.route("/like/:id").get(isAuthenticate, likeUnlikeController)
postRoute.route("/post/:id").put(isAuthenticate, updateCaptioncontroller)
postRoute.route("/comment/:id").post(isAuthenticate, commentCreate)
postRoute.route("/comment/:postId/:commentId").delete(isAuthenticate, commentDelete)
postRoute.route("/myPostComment/:postId/:commentId").delete(isAuthenticate,myPostCommentDelete)

export {postRoute}