const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgon = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const app = express();

dotenv.config();
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true}, {useUnifiedTopology:true}, ()=>{
    console.log("connected to mongodb");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgon("common"));

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);

app.get("/",(req,res)=>{
    res.send("Welcome to Home Page!");
});

app.listen(3000,() => {
    console.log("Server running on port 3000");
});