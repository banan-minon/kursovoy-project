const pool = require("../../db");

exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body; 
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Корзина пуста" });
    }

    await client.query("BEGIN");

    let total = 0;
    for (const item of items) {
      const p = await client.query("SELECT price FROM products WHERE id=$1", [item.product_id]);
      if (p.rows.length === 0) throw new Error(`Товар ${item.product_id} не найден`);
      total += parseFloat(p.rows[0].price) * item.quantity;
    }

    const orderRes = await client.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id",
      [userId, total, 'Новый']
    );
    const orderId = orderRes.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.product_id, item.quantity]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Заказ успешно оформлен", orderId });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("ОШИБКА СОЗДАНИЯ ЗАКАЗА:", err);
    res.status(500).json({ message: "Ошибка при создании заказа" });
  } finally {
    client.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT o.id, o.total_price, o.status, o.created_at,
      json_agg(json_build_object('name', p.name, 'quantity', oi.quantity)) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id 
      ORDER BY o.created_at DESC`;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("ОШИБКА ПОЛУЧЕНИЯ ЗАКАЗОВ:", err);
    res.status(500).json({ message: "Ошибка загрузки заказов" });
  }
};