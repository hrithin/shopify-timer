const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const timerRoutes = require("./routes/timerRoute");
const cors = require("cors");

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    /\.myshopify\.com$/, // Allows all Shopify store domains
    /\.trycloudflare\.com$/, // Allows Cloudflare preview domains
    'http://localhost:3000' // Allows local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server running" });
});

app.use("/api/timers", timerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});