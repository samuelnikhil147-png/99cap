const mongoose = require('mongoose');
const Bed = require('./models/Bed');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eetree_hotel');
  const count = await Bed.countDocuments({ 
    status: { $in: ['Booked', 'Checkout Due Today', 'Overstayed'] } 
  });
  console.log('Occupied beds count:', count);
  const customers = await Bed.find({ 
    status: { $in: ['Booked', 'Checkout Due Today', 'Overstayed'] } 
  });
  console.log('Customers found:', customers.map(c => c.customer?.name));
  process.exit();
}
check();
