// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/spendwise", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected Successfully");
})
.catch((error) => {
  console.log("MongoDB Connection Error:", error);
});

// Expense Schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Expense Model
const Expense = mongoose.model("Expense", expenseSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("SpendWise Server Running");
});

// Add Expense
app.post("/add-expense", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: "Expense Added Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Expense
app.put("/update-expense/:id", async (req, res) => {
  try {
    await Expense.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Expense Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Expense
app.delete("/delete-expense/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server Port
const PORT = 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});