import mongoose from 'mongoose';

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

// Add indexes for performance optimization (critical for 150+ orders/day)
billSchema.index({ status: 1, createdAt: -1 }); // For getBills and getOpenOrders
billSchema.index({ tableNo: 1, status: 1 }); // For getActiveOrder
billSchema.index({ createdAt: -1, status: 1 }); // For analytics queries
billSchema.index({ paymentMode: 1, createdAt: -1 }); // For payment method analytics
billSchema.index({ billType: 1, createdAt: -1 }); // For bill type filtering

export default mongoose.model('Bill', billSchema);
