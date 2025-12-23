const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_billing';

const menuItems = [
  { name: 'Margherita Pizza', price: 299, category: 'Pizza' },
  { name: 'Pepperoni Pizza', price: 399, category: 'Pizza' },
  { name: 'Veggie Burger', price: 149, category: 'Burgers' },
  { name: 'Chicken Burger', price: 199, category: 'Burgers' },
  { name: 'Pasta Alfredo', price: 249, category: 'Pasta' },
  { name: 'Pasta Arrabbiata', price: 229, category: 'Pasta' },
  { name: 'French Fries', price: 99, category: 'Sides' },
  { name: 'Garlic Bread', price: 129, category: 'Sides' },
  { name: 'Coke', price: 49, category: 'Beverages' },
  { name: 'Cold Coffee', price: 89, category: 'Beverages' },
  { name: 'Chocolate Brownie', price: 149, category: 'Desserts' },
  { name: 'Vanilla Ice Cream', price: 79, category: 'Desserts' }
];

const adminUser = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'password123',
  role: 'Admin'
};
const cashierUser = {
  username: process.env.CASHIER_USERNAME || 'cashier',
  password: process.env.CASHIER_PASSWORD || 'cashier123',
  role: 'Cashier'
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    await Menu.deleteMany({});
    await Menu.insertMany(menuItems);
    
    await User.deleteMany({});
    const user = new User(adminUser);
    await user.save();
    
    console.log('Menu and Admin user seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
