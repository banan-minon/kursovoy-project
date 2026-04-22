const pool = require("../../db")
const bcrypt = require("bcrypt")

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Пользователь уже существует" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    )

    res.json(newUser.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ошибка сервера" })
  }
}

const jwt = require("jsonwebtoken")

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // ищем пользователя в базе
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Пользователь не найден" })
    }

    const user = userQuery.rows[0]

    // проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Неверный пароль" })
    }

    // создаём JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ошибка сервера" })
  }
}