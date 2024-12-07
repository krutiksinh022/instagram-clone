import mongoose from "mongoose";


export const connectWithDatabse = () => {
    mongoose.connect("mongodb+srv://krutiksinh022:krutik@socialmedia.g7pn2dy.mongodb.net/").then((resp) => {
        console.log("database connected suceesfully !")
    }).catch((error)=>{console.log(error)})
}