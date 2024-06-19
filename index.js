import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import { z } from "zod";
import auth from './auth.js';
import mongoose from 'mongoose';
import authRoute from './routes/auth.rotes.js';
import errorHandler from './errorHandler.js';
import cors from 'cors';
import emailQueue from './utils/emailQueue.js';
import sendEmail from './utils/sendEmail.js';
import postRoute from './routes/post.routes.js';


const app = express();

// Resolve _dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(cors());  // Enable CORS for all routes

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoute);
app.use(postRoute); //All the route belong to Post


// Setup email queue processing
emailQueue.process(async (job) => {
    const { email, subject, template, context } = job.data;
    await sendEmail({ email, subject, template, context })
})

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if(!err){
        mongoose.connect('mongodb://127.0.0.1:27017/test').then(() => console.log("Successfully connected!"));  
        console.log(`Server is running on port ${PORT}`);
    }
});

