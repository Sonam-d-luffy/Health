import mongoose from "mongoose";
import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import InstituteLogin from './routes/InstituteLogin.js'
import pincodeRoutes from "./routes/pincode.js";
import playerRoute from './routes/playerRoute.js'
import academyRoute from './routes/academy.js'
import reportRoute from './routes/reportRoute.js'
import mailRoute from './routes/mailRoute.js'
import nearby from './controllers/sportsAcademies.js'
import activity from './controllers/activity.js'
import territory from './controllers/territory.js'
import institute from './controllers/institute.js'
import fitness from './controllers/fitness.js'

dotenv.config()

const PORT = process.env.PORT

const app = express()


app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json())
app.use('/api/institute', InstituteLogin)
app.use("/api", pincodeRoutes);
app.use('/api/player', playerRoute)
app.use('/api/academy', academyRoute)
app.use('/api/reports',reportRoute)
app.use('/api/mail',mailRoute)
app.use('/api/sports' , nearby)
app.use('/api/activity',activity)
app.use('/api/territory' , territory)
app.use('/api/institute',institute)
app.use('/api/fitness', fitness)




mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

 


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB connection error:", error);
  });
