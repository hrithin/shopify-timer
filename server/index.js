// server/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const timerRoutes = require("./routes/timerRoute"); 

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.get('/',(req,res)=>{
  res.status(200).json({
    message:"hai"
  })
})

// Middleware to parse JSON
app.use(express.json());

// Timer API routes
app.use("/api/timers", timerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
