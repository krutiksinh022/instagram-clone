import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type:String
    },
    image: {
     public_id:String,   
     imageUrl:String   
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment: {
                type: String,
                required:true,
            } 
        }
    ],
    createdAt: {
        type: Date,
        default:Date.now
    }
    
})

export const Post=mongoose.model("Post",postSchema)