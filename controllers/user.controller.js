import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { Post } from "../models/post.model.js"
const userController = (async (req, resp) => {
    try {
        const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
        return resp.status(404).json({
            sucess: false,
            msg:"user already exist"
        })
    }
    const salt=await bcryptjs.genSalt(10)
    const hashPassword=bcryptjs.hashSync(password,salt)
    user = await User.create({
        name,
        email,
        password:hashPassword,
        avtar: {
            public_id: "1234",
             url:"1234"
        } 
    }
        
    )
    return resp.status(201).json({
        success: true,
        msg: "User created sucessfully",
        user:user
    })
    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            sucess: false,
            msg:'Somthing went wrong !'
       }) 
    }
    
})

const signInController = (async (req, resp) => {
    try {
        const { email, password } = req.body
    if (!email, !password) {
       return resp.status(404).json({
            msg:"Email and Password is require "
        })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return resp.status(404).json({
            msg:"user not registered"
        })
    }
    const matchPassword =await bcryptjs.compare(password, user.password)
    if (!matchPassword) {
        return resp.status(404).json({
          msg:"invalid credentials"
        })
        }
    const token= await user.generateToken()
    return resp.status(200).json({
        msg: "user login sucessfully !",
         user: user.name,
         accesToken:token,
        })
    } catch (error) {
       return resp.status(500).json({
           msg:"something went wrong !"
       }) 
    }
    
})
 
const followController = async(req, resp) => {
     try {
         const userToFollow = await User.findById(req.params.id)
         if (!userToFollow) {
             resp.status(404).json({
                msg:"User not available"
            })
         } 
        
         const ownerUser=await User.findById(req.user._id)
         
         if (!ownerUser) {
            return resp.status(404).json({
                msg:"User not available"
            })
         }
         if (userToFollow.followers.includes(req.user._id)) {
             const userToFollowIndex = userToFollow.followers.indexOf(req.user._id)
             userToFollow.followers.splice(userToFollowIndex, 1)
             const ownerUserIndex = ownerUser.following.indexOf(req.params.id)
             ownerUser.following.splice(ownerUserIndex,1)
             await ownerUser.save()
             await userToFollow.save()
            return  resp.status(200).json({
                 sucess: false,
                 message:"you unfollowed user !"
            })
         } else {
             ownerUser.following.push(req.params.id)
         userToFollow.followers.push(req.user._id)
         
         await ownerUser.save()
             await userToFollow.save()
             

        return  resp.status(200).json({
             sucess: true,
             msg:"you started following user"
         })
         }
         
         

     } catch (error) {
       return  resp.status(500).json({
             sucess:false,
             msg: error
         })
     }
}


const updatePasswordController =async (req,resp) => {
 try {
     const user = await User.findById(req.user._id)
     if (!user) {
        return  resp.status(400), json({
             sucess: false,
             msg:"user not found"
         })
     }

     const { oldPassword, newPassword } = req.body
     if (!oldPassword, !newPassword) {
        return resp.status(404).json({
             sucess: false,
             msg:"all detail are require"
         })
     }
     console.log(oldPassword)
     const isPasswordMatch = await bcryptjs.compare(oldPassword, user.password)
     
     if (!isPasswordMatch) {
         return resp.status(404).json({
             success: false,
             msg:"Password does dot match"
         })
     }
     const salt=await bcryptjs.genSalt(10)
    const hashPassword=bcryptjs.hashSync(newPassword,salt)
     user.password = hashPassword,
         user.save()
     return resp.status(200).json({
         sucess: true,
         msg:"possword updated sucessfully !"
     })
  
 } catch (error) {
     console.log(error)
    return resp.status(500).json({
         sucess: false,
         msg:error,
     })
 }   
}

const deleteUser = async(req,resp) => {
    try {
       
        const user = await User.findById(req.user._id)
        if (!user) {
            return resp.status(400).json({
                sucess: false,
                msg:"User not found"
            })
        }
        const userPost = user.post
        const userfollowing = user.following
        const userFollowers=user.followers
        await User.findByIdAndDelete(req.user._id)
        for (let i = 0; i < userPost.length; i++){
            const post = await Post.findByIdAndDelete(userPost[i])
            
        }
        for (let i = 0; i < userfollowing.length; i++){
            const following = await User.findById(userfollowing[i])
            const index = following.followers.indexOf(req.user._id)
            following.followers.splice(index, 1)
           following.save()
        }    

        for (let i = 0; i < userFollowers.length; i++) {
            const followers = await User.findById(userFollowers[i])
            const index = followers.following.indexOf(req.user._id)
            followers.following.splice(index, 1)
            followers.save()
        }
    
        
        //remove from followers 

        return resp.status(200).json({
            sucess: false,
            msg:"User deleted sucessfully "
        })

    } catch (error) {
        console.log(error)
        resp.status(500).json({
            sucess: false,
            msg:error
        })
    }
}

const getMyProfile = async(req,resp) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return resp.status(400).json({
                sucess: false,
                msg:"User not registred "
            })
        }
        return resp.status(200).json({
            sucess: true,
            msg: "User found ",
            user:user
        })
    } catch (error) {
        console.log(error)
         return resp.status(500).json({
            sucess: false,
            msg: "something went wrong ! ",
           
        })
    }


}
const getUserProfile = async(req,resp) => {
    try {
        const getUser = await (await User.findById(req.params.id))
        if (!getUser) {
            return resp.status(404).json({
                sucess: false,
                msg:"User not found"
            })
        }
        return resp.status(200).json({
            sucess: true,
            msg: "User found sucessfully",
            user:getUser
        })
    } catch (error) {
        return resp.status(500).json({
            sucess: false,
                msg:"Something went wrong "
            })
    }
}



export {userController,signInController,followController,updatePasswordController,deleteUser,getMyProfile,getUserProfile}