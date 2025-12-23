const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  tableNo: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Card']
  },
  status: {
    type: String,
    enum: ['Open', 'Billed', 'Paid', 'Cancelled'],
    default: 'Open'
  },
  billType: {
    type: String,
    enum: ['Dine-In', 'Takeaway'],
    default: 'Dine-In'
  },
  customerName: String,
  customerPhone: String,
  kitchenNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
