const express = require('express');
const path = require('path');
const { db, Timestamp } = require('./firebase'); // Import Firestore connection and Timestamp

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Firestore Collection Reference ────────────────────────────────────
const ordersCollection = db.collection('orders');

// ── Helper: Get next token number ─────────────────────────────────────
// This reads all orders and finds the highest ID, then adds 1
async function getNextToken() {
  const snapshot = await ordersCollection.get();
  if (snapshot.empty) {
    return 1; // First order starts at 1
  }
  
  // Find the highest ID in JavaScript (avoids needing Firestore index)
  let maxId = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.id > maxId) {
      maxId = data.id;
    }
  });
  
  return maxId + 1;
}

const menu = [
  // STEAM MOMO
  { id: 1,   name: 'Veg Steam',           category: 'Steam Momo',     halfPrice: 30,  fullPrice: 60,   desc: 'Fresh steamed veg momos served with chutney', img: '/images/veg-steam-momo.jpg' },
  { id: 2,   name: 'Soya Steam',          category: 'Steam Momo',     halfPrice: 40,  fullPrice: 70,   desc: 'Protein-rich soya momos', img: '/images/soya-steam-momo.webp' },
  { id: 3,   name: 'Paneer Steam',        category: 'Steam Momo',     halfPrice: 40,  fullPrice: 70,   desc: 'Soft paneer filled momos', img: '/images/id-3.webp' },
  { id: 4,   name: 'Cheese Corn Steam',   category: 'Steam Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Cheesy corn stuffed momos', img: '/images/id-4.webp' },
  { id: 5,   name: 'Chilly Paneer Steam', category: 'Steam Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Spicy chilly paneer momos', img: '/images/id-5.webp' },

  // FRIED MOMO
  { id: 6,   name: 'Veg Fried',           category: 'Fried Momo',     halfPrice: 40,  fullPrice: 70,   desc: 'Crispy fried veg momos', img: 'https://store1234566.infinityfreeapp.com/wp-content/uploads/2025/07/1000026316.jpg' },
  { id: 7,   name: 'Soya Fried',          category: 'Fried Momo',     halfPrice: 40,  fullPrice: 70,   desc: 'Crispy soya fried momos', img: '/images/id-7.webp' },
  { id: 8,   name: 'Paneer Fried',        category: 'Fried Momo',     halfPrice: 50,  fullPrice: 90,   desc: 'Golden paneer fried momos', img: '/images/id-8.webp' },
  { id: 9,   name: 'Cheese Corn Fried',   category: 'Fried Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Cheesy corn fried momos', img: '/images/id-9.webp' },
  { id: 10,  name: 'Chilly Paneer Fried', category: 'Fried Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Spicy chilly paneer fried', img: '/images/id-10.webp' },

  // KURKURE MOMO
  { id: 11,  name: 'Veg Kurkure',         category: 'Kurkure Momo',   halfPrice: 60,  fullPrice: 110,  desc: 'Extra crunchy veg momos', img: '/images/id-11.webp' },
  { id: 12,  name: 'Soya Kurkure',        category: 'Kurkure Momo',   halfPrice: 60,  fullPrice: 110,  desc: 'Crispy kurkure soya momos', img: '/images/id-12.webp' },
  { id: 13,  name: 'Paneer Kurkure',      category: 'Kurkure Momo',   halfPrice: 70,  fullPrice: 130,  desc: 'Crunchy paneer kurkure', img: '/images/id-13.webp' },
  { id: 14,  name: 'Cheese Corn Kurkure', category: 'Kurkure Momo',   halfPrice: 80,  fullPrice: 150,  desc: 'Cheesy corn kurkure momos', img: '/images/id-14.webp' },
  { id: 15,  name: 'Chilly Paneer Kurkure',category: 'Kurkure Momo',  halfPrice: 80,  fullPrice: 150,  desc: 'Spicy kurkure chilly paneer', img: '/images/id-15.webp' },

  // GRAVY MOMO
  { id: 16,  name: 'Veg Gravy',           category: 'Gravy Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Momos in spicy gravy', img: '/images/id-16.webp' },
  { id: 17,  name: 'Soya Gravy',          category: 'Gravy Momo',     halfPrice: 60,  fullPrice: 110,  desc: 'Soya momos in rich gravy', img: '/images/id-17.webp' },
  { id: 18,  name: 'Paneer Gravy',        category: 'Gravy Momo',     halfPrice: 70,  fullPrice: 130,  desc: 'Paneer momos in gravy', img: '/images/id-18.webp' },
  { id: 19,  name: 'Cheese Corn Gravy',   category: 'Gravy Momo',     halfPrice: 80,  fullPrice: 150,  desc: 'Cheesy corn in spicy gravy', img: '/images/id-19.webp' },
  { id: 20,  name: 'Chilly Paneer Gravy', category: 'Gravy Momo',     halfPrice: 80,  fullPrice: 150,  desc: 'Chilly paneer gravy momos', img: '/images/id-20.webp' },

  // SCHEZWAN MOMO
  { id: 21,  name: 'Veg Schezwan',        category: 'Schezwan Momo',  halfPrice: 60,  fullPrice: 110,  desc: 'Veg momos in schezwan sauce', img: '/images/id-21.webp' },
  { id: 22,  name: 'Soya Schezwan',       category: 'Schezwan Momo',  halfPrice: 50,  fullPrice: 100,  desc: 'Soya schezwan momos', img: '/images/id-22.webp' },
  { id: 23,  name: 'Paneer Schezwan',     category: 'Schezwan Momo',  halfPrice: 60,  fullPrice: 120,  desc: 'Paneer schezwan momos', img: '/images/id-23.webp' },
  { id: 24,  name: 'Cheese Corn Schezwan',category: 'Schezwan Momo',  halfPrice: 80,  fullPrice: 150,  desc: 'Cheesy corn schezwan', img: '/images/id-24.webp' },
  { id: 25,  name: 'Chilly Paneer Schezwan',category:'Schezwan Momo', halfPrice: 80,  fullPrice: 150,  desc: 'Chilly paneer schezwan', img: '/images/id-25.webp' },

  // MEENU'S KITCHEN SPECIAL
  { id: 26,  name: 'Kurkure Mushroom',    category: 'Special',        price: 100,     desc: 'Crispy kurkure mushroom', img: '/images/id-26.webp' },
  { id: 27,  name: 'Kurkure Soya Chaap',  category: 'Special',        price: 100,     desc: 'Crunchy soya chaap kurkure', img: '/images/id-27.webp' },
  { id: 28,  name: 'Cheese Corn Dog',     category: 'Special',        price: 100,     desc: 'Cheesy corn dog delight', img: '/images/id-28.webp' },

  // CHILLY POTATO
  { id: 29,  name: 'Chilly Potato',       category: 'Chilly Potato',  halfPrice: 80,  fullPrice: 120,  desc: 'Crispy spicy chilly potato', img: '/images/id-29.webp' },
  { id: 30,  name: 'Honey Chilly Potato', category: 'Chilly Potato',  halfPrice: 100, fullPrice: 150,  desc: 'Sweet & spicy honey chilly', img: '/images/id-30.webp' },

  // NOODLES
  { id: 31,  name: 'Veg Noodles',         category: 'Noodles',        halfPrice: 60,  fullPrice: 90,   desc: 'Classic stir-fried veg noodles', img: '/images/id-31.webp' },
  { id: 32,  name: 'Paneer Noodles',      category: 'Noodles',        halfPrice: 100, fullPrice: 120,  desc: 'Noodles with paneer chunks', img: '/images/id-32.webp' },
  { id: 33,  name: 'Hakka Noodles',       category: 'Noodles',        halfPrice: 100, fullPrice: 120,  desc: 'Indo-Chinese hakka noodles', img: '/images/id-33.webp' },
  { id: 34,  name: 'Singapur Noodles',    category: 'Noodles',        halfPrice: 100, fullPrice: 120,  desc: 'Spicy singapore style noodles', img: '/images/id-34.webp' },
  { id: 35,  name: 'Chilly Garlic Noodles',category: 'Noodles',       halfPrice: 100, fullPrice: 120,  desc: 'Garlicky spicy noodles', img: '/images/id-35.webp' },

  // MANCHURIAN
  { id: 36,  name: 'Veg Manchurian',      category: 'Manchurian',     halfPrice: 100, fullPrice: 120,  desc: 'Crispy veg balls in manchurian', img: '/images/id-36.webp' },
  { id: 37,  name: 'Chilly Paneer',       category: 'Manchurian',     halfPrice: 120, fullPrice: 150,  desc: 'Indo-Chinese chilly paneer', img: '/images/id-37.webp' },

  // FRIED RICE
  { id: 38,  name: 'Veg Fried Rice',      category: 'Fried Rice',     halfPrice: 80,  fullPrice: 120,  desc: 'Classic veg fried rice', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  { id: 39,  name: 'Paneer Fried Rice',   category: 'Fried Rice',     halfPrice: 100, fullPrice: 150,  desc: 'Fried rice with paneer', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },
  { id: 40,  name: 'Schezwan Fried Rice', category: 'Fried Rice',     halfPrice: 100, fullPrice: 150,  desc: 'Spicy schezwan fried rice', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop' },

  // BURGERS
  { id: 41,  name: 'Potato Crispy',       category: 'Burgers',        price: 40,      desc: 'Crispy aloo patty burger', img: '/images/id-41.webp' },
  { id: 42,  name: 'Potato Crispy Cheese',category: 'Burgers',        price: 60,      desc: 'Aloo patty with cheese', img: '/images/id-42.webp' },
  { id: 43,  name: 'Paneer Crispy',       category: 'Burgers',        price: 70,      desc: 'Crispy paneer patty burger', img: '/images/id-43.png' },
  { id: 44,  name: 'Paneer Crispy Cheese',category: 'Burgers',        price: 90,      desc: 'Paneer patty with cheese', img: '/images/id-44.webp' },
  { id: 45,  name: 'Kurkure Paneer Cheese',category: 'Burgers',       price: 120,     desc: 'Crunchy kurkure paneer burger', img: '/images/id-45.webp' },

  // SANDWICH
  { id: 46,  name: 'Veg Sandwich',        category: 'Sandwich',       price: 60,      desc: 'Classic veg grilled sandwich', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
  { id: 47,  name: 'Veg Cheese Sandwich', category: 'Sandwich',       price: 90,      desc: 'Cheesy veg sandwich', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
  { id: 48,  name: 'Paneer Cheese Sandwich',category: 'Sandwich',     price: 120,     desc: 'Loaded paneer cheese sandwich', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },

  // FRIES
  { id: 49,  name: 'Classic Fries',       category: 'Fries',          price: 60,      desc: 'Crispy golden french fries', img: '/images/id-51.webp' },
  { id: 50,  name: 'Peri Peri Fries',     category: 'Fries',          price: 80,      desc: 'Spicy peri peri seasoned fries', img: '/images/id-50.webp' },
  { id: 51,  name: 'Cheesey Fries',       category: 'Fries',          price: 100,     desc: 'Fries loaded with cheese', img: '/images/id-49.webp' },

  // SPRING ROLLS
  { id: 52,  name: 'Veg Spring Rolls',    category: 'Spring Rolls',   price: 60,      pieces: 2, desc: 'Crispy veg spring rolls', img: '/images/id-52.webp' },
  { id: 53,  name: 'Kurkure Spring Roll', category: 'Spring Rolls',   price: 80,      pieces: 2, desc: 'Extra crunchy spring rolls', img: '/images/id-53.webp' },
  { id: 54,  name: 'Gravy Spring Roll',   category: 'Spring Rolls',   price: 80,      pieces: 2, desc: 'Spring rolls in gravy', img: '/images/id-54.webp' },
  { id: 55,  name: 'Schezwan Spring Rolls',category: 'Spring Rolls',  price: 80,      pieces: 2, desc: 'Schezwan flavored rolls', img: '/images/id-55.webp' },
];

// ── API Routes ────────────────────────────────────────────────────────

// Get menu
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// Place order - saves to Firestore
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, tableNumber, items, paymentMethod, specialNote } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate and calculate total on server side
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = menu.find(m => m.id === item.id);
      if (!menuItem || item.qty < 1) {
        return res.status(400).json({ error: 'Invalid item in order' });
      }

      // Determine price based on variant (half/full) or single price
      let itemPrice;
      if (item.variant === 'half' && menuItem.halfPrice) {
        itemPrice = menuItem.halfPrice;
      } else if (item.variant === 'full' && menuItem.fullPrice) {
        itemPrice = menuItem.fullPrice;
      } else {
        itemPrice = menuItem.price || menuItem.fullPrice || menuItem.halfPrice;
      }

      const lineTotal = itemPrice * item.qty;
      total += lineTotal;
      orderItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: itemPrice,
        qty: item.qty,
        variant: item.variant || null,
        lineTotal,
      });
    }

    // Total is just the item subtotal (no extra fees for customer)
    // Note: Vendor fee of ₹1/order is tracked separately in admin reports

    // Get the next token number from Firestore
    const nextToken = await getNextToken();

    const order = {
      id: nextToken,
      customerName: String(customerName).substring(0, 50),
      tableNumber: tableNumber ? String(tableNumber).substring(0, 10) : 'N/A',
      items: orderItems,
      total,
      paymentMethod: paymentMethod === 'counter' ? 'Pay at Counter' : 'UPI (Simulated)',
      specialNote: specialNote ? String(specialNote).substring(0, 200) : '',
      status: 'New',
      subtotal: total, // Use 'subtotal' to match what vendor.html expects
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      createdAt: Timestamp.now(), // Use Firestore Timestamp for proper date queries
      paymentStatus: paymentMethod === 'counter' ? 'Pay at Counter' : 'Paid', // Add paymentStatus for vendor display
    };

    // Save order to Firestore (use token number as document ID)
    await ordersCollection.doc(String(nextToken)).set(order);

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders (vendor) - fetches from Firestore
// Only returns TODAY's orders for the vendor dashboard
app.get('/api/orders', async (req, res) => {
  try {
    // Get today's date boundaries as Firestore Timestamps
    const now = new Date();
    const todayStart = Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    const tomorrowStart = Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));

    // Get all orders from Firestore
    const snapshot = await ordersCollection.get();
    
    const orders = [];
    snapshot.forEach(doc => {
      const order = doc.data();
      // Filter: only include orders created today
      // Handle both Firestore Timestamp and old ISO string formats
      if (order.createdAt) {
        // Convert Firestore Timestamp to Date for comparison
        const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const todayDate = todayStart.toDate();
        const tomorrowDate = tomorrowStart.toDate();
        
        if (orderDate >= todayDate && orderDate < tomorrowDate) {
          orders.push(order);
        }
      }
    });
    
    // Sort by ID descending (newest first) in JavaScript
    orders.sort((a, b) => b.id - a.id);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (vendor) - updates Firestore
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const allowed = ['New', 'Preparing', 'Ready', 'Done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get the order document
    const orderRef = ordersCollection.doc(String(id));
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status in Firestore
    await orderRef.update({ status });

    // Return updated order
    const updatedDoc = await orderRef.get();
    res.json({ success: true, order: updatedDoc.data() });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get single order status (for customer polling) - reads from Firestore
app.get('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const orderDoc = await ordersCollection.doc(String(id)).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(orderDoc.data());
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ── Admin Report API ──────────────────────────────────────────────────
// Returns statistics for admin dashboard
// Available at both /api/admin/report and /api/admin-report
app.get('/api/admin-report', async (req, res) => {
  try {
    // Get all orders from Firestore (no orderBy to avoid index requirement)
    const snapshot = await ordersCollection.get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push(doc.data());
    });

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of this week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Filter orders by date
    const todayOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      // Handle both Firestore Timestamp and old ISO string formats
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= today;
    });

    const weekOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      // Handle both Firestore Timestamp and old ISO string formats
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= startOfWeek;
    });

    // Calculate statistics
    const totalOrdersToday = todayOrders.length;
    const totalOrdersThisWeek = weekOrders.length;
    const completedOrders = orders.filter(o => o.status === 'Done').length;
    const pendingOrders = orders.filter(o => o.status === 'New').length;
    const preparingOrders = orders.filter(o => o.status === 'Preparing').length;
    const readyOrders = orders.filter(o => o.status === 'Ready').length;
    
    // Vendor Fee: ₹1 per order (internal, not shown to customers)
    const vendorFeePerOrder = 1;
    const totalVendorFeeDue = orders.length * vendorFeePerOrder;
    const weeklyVendorFeeDue = weekOrders.length * vendorFeePerOrder;
    
    // Total revenue (customer payments)
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({
      totalOrdersToday,
      totalOrdersThisWeek,
      totalOrdersAllTime: orders.length,
      completedOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      totalVendorFeeDue,
      weeklyVendorFeeDue,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      vendorFeePerOrder,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Alias for /api/admin/report (same functionality)
app.get('/api/admin/report', async (req, res) => {
  // Redirect to the main admin-report endpoint logic
  try {
    const snapshot = await ordersCollection.get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push(doc.data());
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      // Handle both Firestore Timestamp and old ISO string formats
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= today;
    });

    const weekOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      // Handle both Firestore Timestamp and old ISO string formats
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= startOfWeek;
    });

    const totalOrdersToday = todayOrders.length;
    const totalOrdersThisWeek = weekOrders.length;
    const completedOrders = orders.filter(o => o.status === 'Done').length;
    const pendingOrders = orders.filter(o => o.status === 'New').length;
    const preparingOrders = orders.filter(o => o.status === 'Preparing').length;
    const readyOrders = orders.filter(o => o.status === 'Ready').length;
    
    // Vendor Fee: ₹1 per order (internal, not shown to customers)
    const vendorFeePerOrder = 1;
    const totalVendorFeeDue = orders.length * vendorFeePerOrder;
    const weeklyVendorFeeDue = weekOrders.length * vendorFeePerOrder;
    
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({
      totalOrdersToday,
      totalOrdersThisWeek,
      totalOrdersAllTime: orders.length,
      completedOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      totalVendorFeeDue,
      weeklyVendorFeeDue,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      vendorFeePerOrder,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ── Start server ──────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🔥 Meenu's Kitchen - Smart Ordering System`);
  console.log(`   Running at http://localhost:${PORT}`);
  console.log(`   Customer page: http://localhost:${PORT}`);
  console.log(`   Vendor dashboard: http://localhost:${PORT}/vendor.html`);
  console.log(`   Admin report: http://localhost:${PORT}/admin.html\n`);
});
