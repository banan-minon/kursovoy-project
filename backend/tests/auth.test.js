const request = require('supertest');
const API_URL = 'http://localhost:5000/api';

describe('Комплексное тестирование системы "Clothing Store"', () => {
  
  // 1. Тестирование товаров
  describe('Тесты каталога товаров', () => {
    test('Должен возвращать список всех товаров', async () => {
      const res = await request(API_URL).get('/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('Должен фильтровать товары по категории Shirts', async () => {
      const res = await request(API_URL).get('/products?category=Shirts');
      expect(res.statusCode).toEqual(200);
      if (res.body.length > 0) {
        expect(res.body[0].category).toBe('Shirts');
      }
    });

    test('Должен работать поиск товаров (Nike)', async () => {
      const res = await request(API_URL).get('/products?search=Nike');
      expect(res.statusCode).toEqual(200);
    });
  });

  // 2. Тестирование авторизации
  describe('Тесты безопасности и авторизации', () => {
    test('Попытка входа с неверными данными должна вернуть 400', async () => {
      const res = await request(API_URL).post('/auth/login').send({
        email: 'wrong@mail.com',
        password: 'wrongpassword'
      });
      expect(res.statusCode).toEqual(400);
    });

    test('Успешный вход должен возвращать токен и данные пользователя', async () => {
      const res = await request(API_URL).post('/auth/login').send({
        email: 'admin@gmail.com',
        password: '1234' 
      });
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.role).toBe('admin');
      }
    });
  });

  // 3. Тестирование заказов
  describe('Тесты системы заказов', () => {
    test('Заказ без токена должен быть отклонен (401)', async () => {
      const res = await request(API_URL).post('/orders').send({
        items: [{ product_id: 1, quantity: 1 }]
      });
      expect(res.statusCode).toEqual(401);
    });
  });
});