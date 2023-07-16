import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import cors from 'cors';
import dotenv from 'dotenv';
const app=express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api/user',router);
app.use('/api/blog',blogRouter);

const PORT = process.env.PORT||5000;
mongoose.set('strictQuery', true)
const CONNECTION_URL= "mongodb+srv://kvatsadeo:9204504597@cluster0.bwpsssx.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

 