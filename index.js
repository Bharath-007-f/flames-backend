require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Create FLAMES table if not exists
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flames (
      id SERIAL PRIMARY KEY,
      name1 TEXT,
      name2 TEXT,
      result TEXT,
      ip_address TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
createTable();

// Store FLAMES result
app.post("/save", async (req, res) => {
  const { name1, name2, result, ip } = req.body;
  try {
    await pool.query(
      "INSERT INTO flames (name1, name2, result, ip_address) VALUES ($1, $2, $3, $4)",
      [name1, name2, result, ip]
    );
    res.status(201).json({ message: "Data stored!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error!" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
