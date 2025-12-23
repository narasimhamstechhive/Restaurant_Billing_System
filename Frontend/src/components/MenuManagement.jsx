import React, { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../api/menu';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null });
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    type: 'veg',
    description: ''
  });

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
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        type: item.type || 'veg',
        description: item.description || ''
      });
    } else {
      setCurrentItem(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        type: 'veg',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await updateMenuItem(currentItem._id, formData);
      } else {
        await addMenuItem(formData);
      }
      fetchItems();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, itemId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;

    try {
      await deleteMenuItem(deleteModal.itemId);
      fetchItems();
      setDeleteModal({ isOpen: false, itemId: null });
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-full text-text-muted">Loading...</div>;

  return (
    <div className="h-full flex flex-col bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Menu Management</h1>
          <p className="text-text-muted">Manage your restaurant's menu items</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search items..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main"
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Name</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Category</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Type</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Price</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                  <td className="p-4 font-medium text-text-main">{item.name}</td>
                  <td className="p-4 text-text-muted">
                    <span className="px-2 py-1 bg-background rounded-md border border-border text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'veg' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-text-main">₹{item.price}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 hover:bg-background rounded-lg text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item._id)}
                        className="p-2 hover:bg-background rounded-lg text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-main">
                {currentItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-main transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Item Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary"
                  placeholder="e.g. Butter Chicken"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-muted">Category</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary"
                    placeholder="e.g. Main Course"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-muted">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="veg"
                      checked={formData.type === 'veg'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-text-main">Veg</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      value="non-veg"
                      checked={formData.type === 'non-veg'}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-text-main">Non-Veg</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="Item description..."
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                  {currentItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default MenuManagement;
