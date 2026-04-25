require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bed = require('./models/Bed');
const Bill = require('./models/Bill');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/99cap";

if (!MONGO_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in environment variables');
}

mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/99cap', { 
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000 
});

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// GET Health Check (to verify DB connection on Vercel)
app.get('/api/health', async (req, res) => {
  res.json({ 
    status: 'active', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    uri_present: !!MONGO_URI,
    uri_preview: MONGO_URI ? MONGO_URI.substring(0, 25) + '...' : 'none',
    env_keys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY'))
  });
});

// GET Migration (Temporary route to seed data from Vercel)
app.get('/api/migrate', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected yet' });
    }

    // 1. Create Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    }

    // 2. Create Staff User
    const staffExists = await User.findOne({ username: 'staff' });
    if (!staffExists) {
      await User.create({ username: 'staff', password: 'staff', role: 'staff' });
    }

    // 3. Create 200 Beds
    const currentBedCount = await Bed.countDocuments();
    if (currentBedCount < 200) {
      const bedsToAdd = [];
      for (let i = currentBedCount + 1; i <= 200; i++) {
        bedsToAdd.push({ 
          id: i, 
          status: 'Available', 
          price: 350, 
          unitType: 'Premium Unit', 
          occupancyType: 'Standard Single Occupancy' 
        });
      }
      if (bedsToAdd.length > 0) {
        await Bed.insertMany(bedsToAdd);
      }
    }

    res.json({ 
      message: 'Migration successful!', 
      details: `Admin and Staff users verified. Total beds: 200 (Added ${200 - currentBedCount} new beds).` 
    });
  } catch (error) {
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
});

// GET Login (for debugging/browser)
app.get('/api/login', (req, res) => {
  res.json({ message: 'Login endpoint active. Please use POST request to login.' });
});

// POST Login
app.post('/api/login', async (req, res) => {
  let { username, password } = req.body;
  
  // Normalize inputs: trim and lowercase username
  username = username?.trim().toLowerCase();
  password = password?.trim();

  console.log(`Login attempt: username="${username}"`);
  
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      console.log(`Login SUCCESS: found user "${user.username}" with role "${user.role}"`);
      res.json({ 
        username: user.username, 
        role: user.role,
        message: 'Login successful' 
      });
    } else {
      console.log(`Login FAILED: No user found for "${username}"`);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


// GET all beds with dynamic status updates
app.get('/api/beds', async (req, res) => {
  try {
    const beds = await Bed.find().sort({ id: 1 });
    const today = new Date().toISOString().split('T')[0];

    const updatedBeds = beds.map(bed => {
      if (bed.status === 'Booked' || bed.status === 'Checkout Due Today' || bed.status === 'Overstayed') {
        if (bed.customer && bed.customer.checkOut) {
          const checkOut = bed.customer.checkOut;
          if (checkOut === today) {
            bed.status = 'Checkout Due Today';
          } else if (checkOut < today) {
            bed.status = 'Overstayed';
          }
        }
      }
      return bed;
    });

    res.json(updatedBeds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
});

// POST book a bed
app.post('/api/book', async (req, res) => {
  const { bedId, customer } = req.body;
  if (!bedId || !customer) {
    return res.status(400).json({ error: 'Missing details' });
  }

  try {
    const bed = await Bed.findOne({ id: parseInt(bedId) });
    if (!bed || bed.status !== 'Available') {
      return res.status(400).json({ error: 'Bed not available' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (customer.checkIn < today) return res.status(400).json({ error: 'Past check-in' });
    if (customer.checkOut <= customer.checkIn) return res.status(400).json({ error: 'Invalid stay' });

    bed.status = 'Booked';
    bed.customer = customer;
    await bed.save();
    res.json(bed);
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

// POST extend stay
app.post('/api/extend', async (req, res) => {
  const { bedId, additionalDays } = req.body;
  if (!bedId || !additionalDays) return res.status(400).json({ error: 'Missing details' });

  try {
    const bed = await Bed.findOne({ id: parseInt(bedId) });
    if (!bed || !bed.customer) return res.status(404).json({ error: 'Booking not found' });

    const currentOut = new Date(bed.customer.checkOut);
    currentOut.setDate(currentOut.getDate() + parseInt(additionalDays));
    bed.customer.checkOut = currentOut.toISOString().split('T')[0];
    
    // Status will be re-calculated on next GET
    await bed.save();
    res.json(bed);
  } catch (error) {
    res.status(500).json({ error: 'Extension failed' });
  }
});

// POST checkout
app.post('/api/checkout', async (req, res) => {
  const { bedId, receiptData } = req.body;
  console.log('Checkout requested for Bed:', bedId);
  console.log('Receipt Data received:', receiptData);
  try {
    const bed = await Bed.findOne({ id: parseInt(bedId) });
    if (!bed) return res.status(404).json({ error: 'Bed not found' });

    // Save Bill if data provided
    if (receiptData) {
      const newBill = new Bill({
        receiptNo: receiptData.receiptNo || `REC-${Date.now()}`,
        customerName: receiptData.customerName,
        bedId: receiptData.bedId,
        checkIn: receiptData.checkIn,
        checkOut: receiptData.actualCheckOut || receiptData.plannedCheckOut,
        stayedDays: receiptData.stayedDays || receiptData.days,
        dailyRate: receiptData.rate || 350,
        totalAmount: receiptData.totalAmount
      });
      await newBill.save();
    }

    bed.status = 'Available';
    bed.customer = null;
    await bed.save();
    res.json({ message: 'Checked out successfully and bill saved' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// GET today's checkouts
app.get('/api/checkouts/today', async (req, res) => {
  try {
    // Calculate start of today in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Calculate start of tomorrow in UTC
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    console.log('Fetching checkouts between:', today.toISOString(), 'and', tomorrow.toISOString());

    const checkouts = await Bed.find({
      'customer.checkOut': {
        $gte: today,
        $lt: tomorrow
      },
      status: { $in: ['Booked', 'Checkout Due Today', 'Overstayed'] }
    });

    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today\'s checkouts' });
  }
});

// GET statistics
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Bed.countDocuments();
    const active = await Bed.countDocuments({ status: { $in: ['Booked', 'Checkout Due Today', 'Overstayed'] } });
    const available = await Bed.countDocuments({ status: 'Available' });
    
    res.json({
      total,
      active,
      available,
      occupancyRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Stats failed' });
  }
});

// GET all customers (occupied beds)
app.get('/api/customers', async (req, res) => {
  try {
    const beds = await Bed.find({ 
      status: { $in: ['Booked', 'Checkout Due Today', 'Overstayed'] } 
    }).sort({ id: 1 });
    
    const customers = beds.map(bed => ({
      ...bed.customer,
      bedId: bed.id,
      status: bed.status
    }));
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET Admin Analytics
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const todayBills = await Bill.find({ createdAt: { $gte: today, $lt: tomorrow } });
    const todayRevenue = todayBills.reduce((sum, b) => sum + b.totalAmount, 0);

    // Monthly Logic
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyBills = await Bill.find({ createdAt: { $gte: monthStart } });
    const monthlyRevenue = monthlyBills.reduce((sum, b) => sum + b.totalAmount, 0);

    const beds = await Bed.find();
    const stats = {
      totalBeds: beds.length,
      available: beds.filter(b => b.status === 'Available').length,
      booked: beds.filter(b => ['Booked', 'Checkout Due Today', 'Overstayed'].includes(b.status)).length,
      maintenance: beds.filter(b => b.status === 'Maintenance').length,
      todayRevenue,
      monthlyRevenue,
      todayCheckouts: todayBills.length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET All Bills
app.get('/api/admin/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
