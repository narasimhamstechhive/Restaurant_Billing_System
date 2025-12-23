import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../api/menu';

const MenuGrid = ({ onSelectItem, searchTerm = '' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getMenuItems();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Fallback items for demo
      setItems([
        { _id: '1', name: 'Burger', price: 150, category: 'Fast Food', description: 'Juicy beef patty with cheese' },
        { _id: '2', name: 'Pizza', price: 350, category: 'Fast Food', description: 'Cheesy pepperoni pizza' },
        { _id: '3', name: 'Pasta', price: 250, category: 'Italian', description: 'Creamy alfredo pasta' },
        { _id: '4', name: 'Coffee', price: 80, category: 'Beverages', description: 'Hot brewed coffee' },
        { _id: '5', name: 'Sandwich', price: 120, category: 'Fast Food', description: 'Grilled cheese sandwich' },
        { _id: '6', name: 'Coke', price: 40, category: 'Beverages', description: 'Chilled cola drink' },
      ]);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(items.map(item => item.category))];
  
  const filteredItems = items.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="flex items-center justify-center h-full text-text-muted">Loading Menu...</div>;

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* Top Bar: Categories */}
      <div className="p-4 border-b border-border bg-surface z-10 flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                category === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 ring-2 ring-primary/20' 
                  : 'bg-background text-text-muted hover:bg-surface-hover hover:text-text-main border border-border'
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-background/50">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {filteredItems.map(item => (
            <div 
              key={item._id} 
              className="bg-surface rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden flex flex-col h-full border border-border/50 hover:border-primary/20" 
              onClick={() => onSelectItem(item)}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-text-main leading-tight pr-2 group-hover:text-primary transition-colors">{item.name}</h3>
                    {item.type && (
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ring-2 ring-white ${item.type === 'veg' ? 'bg-success' : 'bg-danger'}`} />
                    )}
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">{item.description || item.category}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-border/50">
                  <span className="font-bold text-xl text-text-main">₹{item.price}</span>
                  <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-primary/20 hover:scale-110 hover:bg-primary-hover transform translate-y-2 group-hover:translate-y-0">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;
