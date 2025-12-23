import React, { useState, useEffect } from 'react';
import Invoice from './Invoice';
import { Search, Eye, CreditCard, Filter, Trash2 } from 'lucide-react';
import { getBills, deleteBill } from '../api/billing';
import useDebounce from '../hooks/useDebounce';
import ConfirmationModal from './ConfirmationModal';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, billId: null });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const data = await getBills();
      setBills(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, billId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.billId) return;
    
    try {
      await deleteBill(deleteModal.billId);
      setBills(bills.filter(bill => bill._id !== deleteModal.billId));
      setDeleteModal({ isOpen: false, billId: null });
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill');
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || bill.billType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-full text-text-muted">Loading History...</div>;

  return (
    <div className="h-full flex flex-col bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Transaction History</h1>
          <p className="text-text-muted">View and manage past transactions</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search Bill #..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary text-text-main appearance-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Dine-In">Dine-In</option>
              <option value="Takeaway">Takeaway</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Bill #</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Date & Time</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Type</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border">Payment</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border text-right">Total</th>
                <th className="p-4 font-semibold text-text-muted border-b border-border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredBills.map(bill => (
                  <tr key={bill._id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                    <td className="p-4 font-medium text-text-main">#{bill.billNumber}</td>
                    <td className="p-4 text-text-muted">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-main">{new Date(bill.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs">{new Date(bill.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        bill.billType === 'Dine-In' 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'bg-accent/10 text-accent-dark border-accent/20'
                      }`}>
                        {bill.billType}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-text-main">
                        <CreditCard size={16} className="text-text-muted" />
                        <span>{bill.paymentMode}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-text-main text-right">₹{bill.total.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setSelectedBill(bill)}
                          className="p-2 hover:bg-background rounded-lg text-primary transition-colors inline-flex items-center gap-2"
                          title="View Invoice"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(bill._id)}
                          className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors inline-flex items-center gap-2"
                          title="Delete Bill"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBill && (
        <Invoice 
          bill={selectedBill} 
          onClose={() => setSelectedBill(null)} 
        />
      )}

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, billId: null })}
        onConfirm={confirmDelete}
        title="Delete Bill"
        message="Are you sure you want to delete this bill? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default BillHistory;
