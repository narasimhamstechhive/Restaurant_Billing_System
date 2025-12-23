const Bill = require('../models/Bill');

// Get active order for a table
const getActiveOrder = async (req, res) => {
  try {
    const { tableNo } = req.params;
    const order = await Bill.findOne({ 
      tableNo, 
      status: { $in: ['Open', 'Billed'] } 
    });
    res.json(order || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or Update Order (Open Status)
const saveOrder = async (req, res) => {
  try {
    const { tableNo, items, customerName, customerPhone, kitchenNotes, billType } = req.body;

    console.log('Saving Order:', { tableNo, itemsCount: items?.length, billType });

    // Sanitize items and calculate item totals
    const sanitizedItems = items.map(item => ({
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      total: Number(item.price) * Number(item.quantity)
    }));

    let order = await Bill.findOne({ 
      tableNo, 
      status: 'Open' 
    });

    const subtotal = sanitizedItems.reduce((sum, item) => sum + item.total, 0);

    if (order) {
      // Update existing order
      order.items = sanitizedItems;
      order.customerName = customerName;
      order.customerPhone = customerPhone;
      order.kitchenNotes = kitchenNotes;
      order.billType = billType || order.billType;
      
      order.subtotal = subtotal;
      order.total = subtotal; // Tax/Discount applied at billing
      
      await order.save();
    } else {
      // Create new order
      order = await Bill.create({
        tableNo,
        items: sanitizedItems,
        subtotal,
        total: subtotal,
        status: 'Open',
        billType: billType || 'Dine-In',
        customerName,
        customerPhone,
        kitchenNotes
      });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error in saveOrder:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

// Generate Bill (Lock Order)
const generateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, tax } = req.body;
    
    const order = await Bill.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Open') return res.status(400).json({ message: 'Order already billed or paid' });

    // Generate Bill Number with Robust Retry Logic
    // 1. Find the highest bill number currently visible
    const lastBill = await Bill.findOne({ 
      billNumber: { $exists: true, $ne: null } 
    }).sort({ billNumber: -1 });

    let nextBillNum = 1;
    if (lastBill && lastBill.billNumber) {
      const lastNum = parseInt(lastBill.billNumber.replace('BILL-', ''));
      if (!isNaN(lastNum)) {
        nextBillNum = lastNum + 1;
      }
    }

    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
      try {
        const billNumber = `BILL-${String(nextBillNum).padStart(4, '0')}`;

        order.status = 'Billed';
        order.billNumber = billNumber;
        order.discount = discount || 0;
        order.tax = tax || 0;
        
        // Calculate final total
        const taxableAmount = order.subtotal - order.discount;
        const taxAmount = (taxableAmount * order.tax) / 100;
        order.total = Math.round(taxableAmount + taxAmount);

        await order.save();
        return res.json(order); // Success!
        
      } catch (saveError) {
        if (saveError.code === 11000 && saveError.keyPattern && saveError.keyPattern.billNumber) {
          console.warn(`Duplicate bill number ${order.billNumber} detected. Incrementing and retrying...`);
          nextBillNum++; // Just try the next number
          retries++;
          if (retries === maxRetries) {
            throw new Error('Failed to generate unique bill number after multiple attempts');
          }
        } else {
          throw saveError; // Re-throw other errors
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Settle Bill (Payment)
const settleBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMode } = req.body;

    const order = await Bill.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = 'Paid';
    order.paymentMode = paymentMode;
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bills (for history)
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ status: 'Paid' }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a bill
const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all open/billed orders
const getOpenOrders = async (req, res) => {
  try {
    const orders = await Bill.find({ 
      status: { $in: ['Open', 'Billed'] } 
    }).sort({ updatedAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveOrder,
  saveOrder,
  generateBill,
  settleBill,
  getBills,
  deleteBill,
  getOpenOrders
};
