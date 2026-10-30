require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db.js");
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://YOUR-FRONTEND.vercel.app"],

    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN API is running"
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
  connectDB();
});
