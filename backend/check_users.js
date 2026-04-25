require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eetree_hotel";

async function checkUsers() {
  await mongoose.connect(MONGO_URI);
  const users = await User.find({}, { password: 0 });
  console.log('Users found:', users);
  process.exit(0);
}

checkUsers();
