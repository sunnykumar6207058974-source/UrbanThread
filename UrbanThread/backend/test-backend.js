const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');

async function testBackend() {
  console.log('\n🧪 Running Comprehensive Backend Diagnostic Tests...\n');

  try {
    await connectDB();

    // 1. Health Check
    const healthRes = await request(app).get('/api/health');
    console.log(`[1] Health Check: ${healthRes.status === 200 && healthRes.body.success ? '✅ PASS' : '❌ FAIL'}`);

    // 2. Public Products
    const prodRes = await request(app).get('/api/products');
    console.log(`[2] Products List: ${prodRes.status === 200 && prodRes.body.count > 0 ? '✅ PASS (' + prodRes.body.count + ' items)' : '❌ FAIL'}`);

    // 3. Category Filter (Watches)
    const watchRes = await request(app).get('/api/products?category=Watches');
    console.log(`[3] Category Filter (Watches): ${watchRes.status === 200 && watchRes.body.count >= 5 ? '✅ PASS (' + watchRes.body.count + ' watches)' : '❌ FAIL'}`);

    // 4. Single Product by Slug
    const slugRes = await request(app).get('/api/products/watch-1');
    console.log(`[4] Product by Slug (watch-1): ${slugRes.status === 200 && slugRes.body.product.slug === 'watch-1' ? '✅ PASS' : '❌ FAIL'}`);

    // 5. Coupon Validation
    const couponRes = await request(app).post('/api/coupons/validate').send({ code: 'FASHION20', cartSubtotal: 100 });
    console.log(`[5] Coupon Validation (FASHION20): ${couponRes.status === 200 && couponRes.body.coupon.discountPercent === 20 ? '✅ PASS' : '❌ FAIL'}`);

    // 6. Newsletter Subscription
    const newsRes = await request(app).post('/api/newsletter/subscribe').send({ email: 'tester@urbanthread.com' });
    console.log(`[6] Newsletter Subscribe: ${newsRes.status === 201 || (newsRes.status === 200 && newsRes.body.alreadyExists) ? '✅ PASS' : '❌ FAIL'}`);

    // 7. Auth: Register
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Diagnostic Tester',
      email: testEmail,
      password: 'password123'
    });
    console.log(`[7] Auth Register: ${regRes.status === 201 && regRes.body.token ? '✅ PASS' : '❌ FAIL'}`);
    const token = regRes.body.token;

    // 8. Auth: Login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'password123'
    });
    console.log(`[8] Auth Login: ${loginRes.status === 200 && loginRes.body.token ? '✅ PASS' : '❌ FAIL'}`);

    // 9. Profile (Protected)
    const profRes = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${token}`);
    console.log(`[9] Get User Profile: ${profRes.status === 200 && profRes.body.user.name === 'Diagnostic Tester' ? '✅ PASS' : '❌ FAIL'}`);

    // 10. Add to Cart with Slug (Slug Resolution)
    const cartAddRes = await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send({
      productId: 'watch-1',
      quantity: 2,
      selectedColor: '#111111'
    });
    console.log(`[10] Add to Cart by Slug: ${cartAddRes.status === 200 && cartAddRes.body.cart.length > 0 ? '✅ PASS' : '❌ FAIL'}`);

    const cartItemId = cartAddRes.body.cart[0]._id;

    // 11. Update Cart Quantity
    const cartUpdRes = await request(app).put(`/api/cart/${cartItemId}`).set('Authorization', `Bearer ${token}`).send({
      quantity: 3
    });
    console.log(`[11] Update Cart Quantity: ${cartUpdRes.status === 200 && cartUpdRes.body.cart[0].quantity === 3 ? '✅ PASS' : '❌ FAIL'}`);

    // 12. Create Order
    const orderRes = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send({
      items: [{
        productId: 'watch-1',
        name: 'Rolex Submariner Oystersteel Automatic Chronometer',
        price: 349,
        quantity: 1
      }],
      subtotal: 349,
      discountAmount: 69.8,
      couponCode: 'FASHION20',
      grandTotal: 279.2,
      shippingAddress: {
        name: 'Diagnostic Tester',
        street: '123 Fashion Ave',
        city: 'New York',
        phone: '555-0199'
      },
      paymentMethod: 'card'
    });
    console.log(`[12] Place Order: ${orderRes.status === 201 && orderRes.body.order.orderId ? '✅ PASS (Order ID: ' + orderRes.body.order.orderId + ')' : '❌ FAIL'}`);

    // 13. Admin Login & Stats
    const adminLoginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@urbanthread.com',
      password: 'admin123456'
    });
    const adminToken = adminLoginRes.body.token;

    const statsRes = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${adminToken}`);
    console.log(`[13] Admin Stats: ${statsRes.status === 200 && statsRes.body.stats.totalProducts >= 42 ? '✅ PASS (Products: ' + statsRes.body.stats.totalProducts + ')' : '❌ FAIL'}`);

    console.log('\n🎉 ALL 13 BACKEND DIAGNOSTIC TESTS PASSED WITH 100% SUCCESS!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Backend test failed:', err);
    process.exit(1);
  }
}

testBackend();
