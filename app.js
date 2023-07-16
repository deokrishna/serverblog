import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import blogRouter from "./routes/blog-routes";
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

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

 