const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expense.routes");

const app = express();
app.use(cors());


app.use(express.json());


app.use("/api/expenses", expenseRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

module.exports = app;

