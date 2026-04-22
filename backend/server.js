const express = require("express")
const cors = require("cors")
const pool = require("./db")
const authRoutes = require("./src/routes/authRoutes")
const authMiddleware = require("./src/middleware/authMiddleware")
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express()

app.use(cors())
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(express.json())
app.use("/api/auth", authRoutes)


app.get("/", (req, res) => {
  res.send("API магазина одежды работает")
})

app.get("/products", async (req, res) => {
  const products = await pool.query("SELECT * FROM products")
  res.json(products.rows)
})

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Вы авторизованы", user: req.user })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})




