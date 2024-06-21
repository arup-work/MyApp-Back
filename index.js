import 'dotenv/config';
import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';


import { z } from "zod";
import mongoose from 'mongoose';
import errorHandler from './errorHandler.js';
import cors from 'cors';
import emailQueue from './utils/emailQueue.js';
import sendEmail from './utils/sendEmail.js';
import Route from './routes/index.js';



const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// All routes
app.use('/api/v1',Route);

// Serve static files from the 'public' directory
app.use('/uploads',express.static(path.join(__dirname, 'public')));

// Increase body size limits
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

