import express from "express";
import { connectWithDatabse } from "./config/databse.js";
import { postRoute } from "./routes/post.route.js";
import { userRoute } from "./routes/user.route.js";

const app = express()
app.use(express.json())


connectWithDatabse()

//router

app.use("/api/v1/user", userRoute)
app.use("/api/v1/post",postRoute)



app.listen(8000, () => {
    console.log(`server is running on ${8000} port`)
})