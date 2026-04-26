require('dotenv').config();
const mongoose = require('mongoose');
const Bed = require('./models/Bed');
const Bill = require('./models/Bill');

const resetDB = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) {
      console.error('MONGODB_URI is missing in .env');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Clear everything
    await Bed.deleteMany({});
    await Bill.deleteMany({});
    console.log('Cleared all beds and bills');

    // 2. Create 200 fresh beds
    const beds = [];
    for (let i = 1; i <= 200; i++) {
      beds.push({
        id: i,
        status: 'Available',
        price: 350,
        unitType: 'Premium Unit',
        occupancyType: 'Standard Single Occupancy',
        customer: null
      });
    }

    await Bed.insertMany(beds);
    console.log('Inserted 200 fresh available beds');

    console.log('Database reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Reset failed:', error);
    process.exit(1);
  }
};

resetDB();
