require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Bed = require('./models/Bed');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/99cap";

async function seedData() {
  try {
    console.log('Connecting to Atlas shards (Standard Connection)...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // 1. Create Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
      console.log('Admin user created');
    }

    // 2. Create Staff User
    const staffExists = await User.findOne({ username: 'staff' });
    if (!staffExists) {
      await User.create({ username: 'staff', password: 'staff', role: 'staff' });
      console.log('Staff user created');
    }

    // 3. Create 99 Beds
    const bedCount = await Bed.countDocuments();
    if (bedCount === 0) {
      const beds = [];
      for (let i = 1; i <= 99; i++) {
        beds.push({ id: i, status: 'Available', price: 350, unitType: 'Premium Unit', occupancyType: 'Standard Single Occupancy' });
      }
      await Bed.insertMany(beds);
      console.log('99 Beds created');
    }

    console.log('MIGRATION COMPLETE!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

seedData();
