import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,"name is required"]
    },
    email: {
        type: String,
        required:[true,"Email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        //  select:false
    },
    avtar: {
        public_id: String,
        url:String 
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Post'
       }  
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
       }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
       }
   ]
})
userSchema.methods.generateToken = function () {
    return jsonwebtoken.sign({_id:this._id},"jwtsecretkey")
}

export const User=mongoose.model("User",userSchema)