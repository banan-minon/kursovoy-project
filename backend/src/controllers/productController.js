const pool = require("../../db");

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const values = [];
    let counter = 1;

    if (category && category !== "") {
      query += ` AND category ILIKE $${counter}`;
      values.push(category);
      counter++;
    }

    if (search) {
      query += ` AND name ILIKE $${counter}`;
      values.push(`%${search}%`);
      counter++;
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка загрузки товаров" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) return res.status(404).json({ message: "Товар не найден" });
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, image } = req.body;

    const imagesValue = image ? `{${image}}` : '{}';

    const result = await pool.query(
      "INSERT INTO products (name, description, price, category, size, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        name, 
        description, 
        price, 
        category, 
        size || 'S-XL', 
        imagesValue
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ОШИБКА БД ПРИ ДОБАВЛЕНИИ:", err);
    res.status(500).json({ message: "Ошибка сервера при добавлении товара", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ message: "Товар удалён" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
};