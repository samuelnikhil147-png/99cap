const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  receiptNo: { type: String, required: true },
  customerName: { type: String, required: true },
  bedId: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  stayedDays: { type: Number, required: true },
  dailyRate: { type: Number, default: 350 },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', BillSchema);
