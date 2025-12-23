const mongoose = require('mongoose');
require('dotenv').config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('bills');
    
    // List indexes
    const indexes = await collection.indexes();
    console.log('Current Indexes:', indexes);

    // Drop billNumber index if exists
    const billNumberIndex = indexes.find(idx => idx.key.billNumber);
    if (billNumberIndex) {
      console.log('Dropping billNumber index:', billNumberIndex.name);
      await collection.dropIndex(billNumberIndex.name);
      console.log('Index dropped successfully');
    } else {
      console.log('billNumber index not found');
    }

    console.log('Please restart the backend to recreate the index with sparse: true');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixIndex();
