const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expense.routes");

const app = express();

app.use(
  cors({
    origin: "*",          // allow all origins (safe for college project)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());


app.use("/api/expenses", expenseRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

module.exports = app;
