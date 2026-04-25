const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Reserved', 'Maintenance', 'Checkout Due Today', 'Overstayed'],
    default: 'Available'
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    checkIn: Date,
    checkOut: Date
  },
  price: {
    type: Number,
    default: 350
  },
  unitType: {
    type: String,
    default: 'Premium Unit'
  },
  occupancyType: {
    type: String,
    default: 'Standard Single Occupancy'
  }
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
