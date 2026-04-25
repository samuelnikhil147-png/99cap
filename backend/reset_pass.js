require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eetree_hotel";

async function resetPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Reset Admin
    await User.findOneAndUpdate(
      { username: 'admin' },
      { password: 'admin123', role: 'admin' },
      { upsert: true, new: true }
    );
    
    // Reset Staff
    await User.findOneAndUpdate(
      { username: 'staff' },
      { password: 'staff', role: 'staff' },
      { upsert: true, new: true }
    );
    
    console.log('PASSWORDS RESET SUCCESSFUL!');
    console.log('Admin: admin / admin123');
    console.log('Staff: staff / staff');
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
}

resetPasswords();
