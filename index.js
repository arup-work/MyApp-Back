import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { z } from "zod";
import auth from './auth.js';
import mongoose from 'mongoose';
import authRoute from './routes/auth.rotes.js';
import errorHandler from './errorHandler.js';
import cors from 'cors';
import emailQueue from './utils/emailQueue.js';
import sendEmail from './utils/sendEmail.js';


const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());
app.use(authRoute);

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

