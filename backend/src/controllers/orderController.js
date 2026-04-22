const pool = require("../../db");

// Создать заказ
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ product_id, quantity }]
    const userId = req.user.id;

    // вычисляем total
    let total = 0;
    for (const item of items) {
      const product = await pool.query("SELECT price FROM products WHERE id=$1", [item.product_id]);
      if (product.rows.length === 0) return res.status(400).json({ message: "Товар не найден" });
      total += product.rows[0].price * item.quantity;
    }

    // создаём заказ
    const order = await pool.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [userId, total]
    );

    const orderId = order.rows[0].id;

    // добавляем товары
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2,$3)",
        [orderId, item.product_id, item.quantity]
      );
    }

    res.json({ message: "Заказ создан", order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получить заказы пользователя
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await pool.query("SELECT * FROM orders WHERE user_id=$1", [userId]);
    res.json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};