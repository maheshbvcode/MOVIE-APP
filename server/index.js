import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "dotenv/config";
import routes from "./src/routes/index.js";

import connectDB from './src/mongoDB/connect.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser());

app.use("/api/v1",routes)

const port = process.env.PORT || 5000

const startSever = async() =>{
    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(port, 
            ()=>console.log(`Server is listening on  Port : http://localhost:${port}`)
            );
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}
startSever();



