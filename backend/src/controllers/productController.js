const pool = require("../../db");

// Получить все товары
exports.getProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json(products.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получить товар по id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) return res.status(404).json({ message: "Товар не найден" });
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Добавить товар (только для admin)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, image } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (name, description, price, category, size, image) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, description, price, category, size, image]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Редактировать товар
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, size, image } = req.body;
    const updated = await pool.query(
      "UPDATE products SET name=$1, description=$2, price=$3, category=$4, size=$5, image=$6 WHERE id=$7 RETURNING *",
      [name, description, price, category, size, image, id]
    );
    if (updated.rows.length === 0) return res.status(404).json({ message: "Товар не найден" });
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Товар удалён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};