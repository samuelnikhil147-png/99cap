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

    // 3. Create 200 Beds
    const currentBedCount = await Bed.countDocuments();
    if (currentBedCount < 200) {
      const bedsToAdd = [];
      for (let i = currentBedCount + 1; i <= 200; i++) {
        bedsToAdd.push({ id: i, status: 'Available', price: 350, unitType: 'Premium Unit', occupancyType: 'Standard Single Occupancy' });
      }
      if (bedsToAdd.length > 0) {
        await Bed.insertMany(bedsToAdd);
        console.log(`${bedsToAdd.length} new beds created. Total: 200`);
      }
    } else {
      console.log('200 or more beds already exist.');
    }

    console.log('MIGRATION COMPLETE!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

seedData();
