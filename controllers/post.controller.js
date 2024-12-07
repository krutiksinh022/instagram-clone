import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const createPostController = (async (req, resp) => {
    try {
        const { caption } = req.body;
    
    const newPost = await Post.create({
        caption,
        image: {
            public_id: "imageid",
            imageUrl:"imageurl"
        },
        owner: req.user._id,
    })
    let user = await User.findById(req.user._id)
    
    user.post.push(newPost._id)
    user.save()

        resp.status(201).json({
        sucess:true,
        msg: "post created sucessfully !",
        post:newPost
    })
    } catch (error) {
        resp.status(500).json({
            sucess:false,
           msg:error
       }) 
    }
})

const likeUnlikeController = (async(req,resp) => {
    try {
        
        const findPost = await Post.findById(req.params.id)
        
        if (findPost.likes.includes(req.user._id)) {
            const index = findPost.likes.indexOf(req.user._id)
            
            findPost.likes.splice(index, 1)
             
            await findPost.save()

            return resp.status(200).json({
                msg:"post already liked"
            })
        }
        
        findPost.likes.push(req.user._id)
        await findPost.save()
        resp.status(200).json({
            sucess:true,
            msg:"post liked !"
        })
    } catch (error) {
        resp.status(500).json({
            sucess: false,
            msg:error
     })   
    }
})

const deletePostController = (async(req,resp) => {
    try {

        const findPost = await Post.findById(req.params.id)
        


        if (!findPost) {
            return resp.status(404).json({
                sucess: false,
                msg:"Post not found ! "
            })
        }
        
        if (findPost.owner.toString() !== req.user._id.toString()) {
            console.log(findPost.owner.toString(),req.user._id.toString())
            return resp.status(404).json({
                sucess: false,
                msg:"unauthorized user !"
            })
        }

        await Post.findByIdAndDelete(req.params.id)

        const user=await User.findById(req.user._id)
        
        if (user.post.includes(req.params.id)) {
           
            const index = user.post.indexOf(req.params.id)
            user.post.splice(index,1)
            user.save()
        }

        resp.status(200).json({
            masg:" Post deleted sucessfully !"
        })
       
    
    } catch (error) {
        return resp.status(500).json({
            msg:error
        })
    }
})

const getFollowingUserPost =async (req,resp) => {
    try {
        
        const logedInUser = await User.findById(req.user._id)

        const post = await Post.find({
            owner: {
                $in:logedInUser.following
            }
        })
       return resp.status(200).json({
           sucess: true,
           message:"post retrived sucessfully !",
           post: post,
        })
        
       
    } catch (error) {
        return resp.status(404).json({
            sucess: false,
            msg:error
        })
    }
}

const updateCaptioncontroller =async (req,resp) => {
    try {
        const findPost = await Post.findById(req.params.id)
        
       if (findPost.owner.toString() !== req.user._id.toString()) {
            return resp.status(400).json({
                sucess: false,
                msg:"unauthorized user"
            })
        }
        findPost.caption = req.body.caption
        findPost.save()
        return resp.status(200).json({
           sucess: true,
           msg:findPost
     })
        
    } catch (error) {
        resp.status(500).json({
            sucess: false,
            msg:error,
        })
    }
}

const commentCreate = async(req,resp) => {
    try {
        let commentIndex = -1;
        const findPost = await Post.findById(req.params.id)
        if (!findPost) {
            return resp.status(404).json({
                sucess:false,
                msg: "post not found",
            })
        }

     
            
        findPost.comments.forEach((comment,index) => {
            if (comment.user.toString()== req.user._id) {
                commentIndex =index 
            }
        })
        if (commentIndex!==-1) {
            findPost.comments[commentIndex].comment = req.body.comment
            
            await findPost.save()
             
            return resp.status(201).json({
                    sucess:true,
                    msg: "comment updated sucessfully !"
                    
                })
        } else {
           const createComment = { user: req.user._id, comment: req.body.comment }
        findPost.comments.push(createComment)
        await findPost.save()
        return resp.status(201).json({
            sucess: true,
            msg: "comment created sucessfully !"
            
        })    
         }
        
    } catch (error) {
        console.log(error,"fjf")
        resp.status(500).json({
            sucess:false,
           msg:"something went wrong !"
       }) 
    }
}
const commentDelete =async (req,resp) => {
    try {
        const{postId,commentId}=req.params
        let findPost = await Post.findById(postId)
          
       const updatedComent= findPost.comments.filter((item)=>item._id.toString()!==commentId)
       
        findPost.comments = [...updatedComent]
        await findPost.save()
        return resp.status(200).json({
            sucess:false,
            msg: "Comment deleted sucessfully !",
        })
    } catch (error) {
        return resp(500).json({
            sucess: false,
            msg:"something went wrong !"
        })
    }
}

const myPostCommentDelete = async (req, resp) => {
    try {
        console.log(req.params.postId)
        const myPost = await Post.findById(req.params.postId)
        if (!myPost) {
            return resp.status(404).json({
                sucess: false,
                msg:"Post not found! ",
            })
        }
        console.log(myPost.owner.toString(),req.user._id.toString())
        if (myPost.owner.toString() === req.user._id.toString()) {
            
            const upadatedComment = myPost.comments.filter((comment) => comment._id.toString() !== req.params.commentId.toString())
            
            myPost.comments = [...upadatedComment]
            await myPost.save()

            return resp.status(200).json({
                sucess: true,
                msg:"Comment deleted sucessfully !"
            })

        } else {
            return resp.status(404).json({
                sucess: false,
                msg:"This is not your post ",
            })
        }
    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            sucess: false,
            msg:"something went wrong "
        })
    }
}
export {createPostController,likeUnlikeController,deletePostController,getFollowingUserPost,updateCaptioncontroller,commentCreate,commentDelete,myPostCommentDelete}