require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Bed = require('./models/Bed');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const DATA_FILE = path.join(__dirname, 'data', 'beds.json');
    if (!fs.existsSync(DATA_FILE)) {
      console.log('No data file found to migrate.');
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Found ${data.length} beds in JSON file.`);

    // Clear existing beds
    await Bed.deleteMany({});
    console.log('Cleared existing beds in MongoDB');

    // Insert new beds
    const bedsToInsert = data.map(bed => ({
      id: bed.id,
      status: bed.status || 'Available',
      customer: bed.customer,
      price: 350,
      unitType: 'Premium Unit',
      occupancyType: 'Standard Single Occupancy'
    }));

    await Bed.insertMany(bedsToInsert);
    console.log('Successfully migrated beds to MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
