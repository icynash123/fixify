const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

// Dashboard protected routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// File access routes (credentials/validID)
app.use("/api/files", require("./routes/fileRoutes"));

app.get("/", (req, res) => {
  res.send("Fixify API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
