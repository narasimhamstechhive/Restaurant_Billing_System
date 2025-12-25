const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const User = require('./models/User');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_billing';

const categories = [
  { name: 'Starters / Appetizers', description: 'Appetizers and starters', sortOrder: 1 },
  { name: 'Soups', description: 'Hot and cold soups', sortOrder: 2 },
  { name: 'Main Course – Veg', description: 'Vegetarian main courses', sortOrder: 3 },
  { name: 'Main Course – Non-Veg', description: 'Non-vegetarian main courses', sortOrder: 4 },
  { name: 'Breads / Rotis', description: 'Indian breads and rotis', sortOrder: 5 },
  { name: 'Rice & Biryani', description: 'Rice dishes and biryanis', sortOrder: 6 },
  { name: 'Fast Food / Snacks', description: 'Fast food and snacks', sortOrder: 7 },
  { name: 'Beverages – Hot', description: 'Hot beverages', sortOrder: 8 },
  { name: 'Beverages – Cold', description: 'Cold beverages', sortOrder: 9 },
  { name: 'Desserts / Sweets', description: 'Desserts and sweets', sortOrder: 10 },
  { name: 'Combos / Thali / Offers', description: 'Combo meals and offers', sortOrder: 11 },
  { name: 'Extras / Add-Ons', description: 'Extra items and add-ons', sortOrder: 12 }
];

const menuItems = [
  // Starters
  { name: 'Veg Manchurian', price: 120, category: 'Starters / Appetizers', type: 'veg', description: 'Crispy vegetable dumplings in spicy sauce' },
  { name: 'Chicken 65', price: 180, category: 'Starters / Appetizers', type: 'non-veg', description: 'Spicy fried chicken bites' },
  { name: 'Fries', price: 80, category: 'Starters / Appetizers', type: 'veg', description: 'Crispy golden fries' },

  // Soups
  { name: 'Tomato Soup', price: 90, category: 'Soups', type: 'veg', description: 'Creamy tomato soup' },
  { name: 'Sweet Corn Soup', price: 100, category: 'Soups', type: 'veg', description: 'Sweet corn in vegetable broth' },

  // Main Course Veg
  { name: 'Paneer Butter Masala', price: 220, category: 'Main Course – Veg', type: 'veg', description: 'Paneer in rich butter gravy' },
  { name: 'Dal Tadka', price: 150, category: 'Main Course – Veg', type: 'veg', description: 'Lentils with tempered spices' },

  // Main Course Non-Veg
  { name: 'Chicken Curry', price: 250, category: 'Main Course – Non-Veg', type: 'non-veg', description: 'Chicken in spicy curry' },
  { name: 'Mutton Curry', price: 320, category: 'Main Course – Non-Veg', type: 'non-veg', description: 'Mutton in rich curry' },

  // Breads
  { name: 'Roti', price: 20, category: 'Breads / Rotis', type: 'veg', description: 'Plain Indian bread' },
  { name: 'Butter Naan', price: 40, category: 'Breads / Rotis', type: 'veg', description: 'Buttered leavened bread' },
  { name: 'Garlic Naan', price: 50, category: 'Breads / Rotis', type: 'veg', description: 'Garlic flavored naan' },

  // Rice & Biryani
  { name: 'Plain Rice', price: 60, category: 'Rice & Biryani', type: 'veg', description: 'Steamed basmati rice' },
  { name: 'Veg Biryani', price: 180, category: 'Rice & Biryani', type: 'veg', description: 'Vegetable biryani with raita' },
  { name: 'Chicken Biryani', price: 250, category: 'Rice & Biryani', type: 'non-veg', description: 'Chicken biryani with boiled egg' },

  // Fast Food
  { name: 'Pizza', price: 200, category: 'Fast Food / Snacks', type: 'veg', description: 'Cheese and tomato pizza' },
  { name: 'Burger', price: 120, category: 'Fast Food / Snacks', type: 'veg', description: 'Veggie burger with fries' },
  { name: 'Noodles', price: 140, category: 'Fast Food / Snacks', type: 'veg', description: 'Veg hakka noodles' },

  // Hot Beverages
  { name: 'Tea', price: 30, category: 'Beverages – Hot', type: 'veg', description: 'Hot tea' },
  { name: 'Coffee', price: 40, category: 'Beverages – Hot', type: 'veg', description: 'Hot brewed coffee' },

  // Cold Beverages
  { name: 'Soft Drinks', price: 50, category: 'Beverages – Cold', type: 'veg', description: 'Coke/Pepsi/Sprite' },
  { name: 'Milkshakes', price: 80, category: 'Beverages – Cold', type: 'veg', description: 'Vanilla/Chocolate/Strawberry' },

  // Desserts
  { name: 'Ice Cream', price: 60, category: 'Desserts / Sweets', type: 'veg', description: 'Vanilla/Chocolate ice cream' },
  { name: 'Gulab Jamun', price: 70, category: 'Desserts / Sweets', type: 'veg', description: 'Sweet dumplings in syrup' },

  // Combos
  { name: 'Veg Thali', price: 180, category: 'Combos / Thali / Offers', type: 'veg', description: 'Complete veg meal' },
  { name: 'Non-Veg Thali', price: 250, category: 'Combos / Thali / Offers', type: 'non-veg', description: 'Complete non-veg meal' },

  // Extras
  { name: 'Extra Cheese', price: 30, category: 'Extras / Add-Ons', type: 'veg', description: 'Extra cheese topping' },
  { name: 'Extra Butter', price: 20, category: 'Extras / Add-Ons', type: 'veg', description: 'Extra butter' },
  { name: 'Extra Gravy', price: 40, category: 'Extras / Add-Ons', type: 'veg', description: 'Extra curry gravy' }
];

const adminUser = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'password123',
  role: 'Admin'
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Category.deleteMany({});
    await Menu.deleteMany({});
    await User.deleteMany({});

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    // Create category map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Update menu items with category IDs
    const menuItemsWithIds = menuItems.map(item => ({
      ...item,
      category: categoryMap[item.category]
    }));

    // Seed menu items
    await Menu.insertMany(menuItemsWithIds);
    console.log('Menu items seeded successfully');

    // Seed admin user
    const user = new User(adminUser);
    await user.save();
    console.log('Admin user seeded successfully');

    console.log('Database seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
