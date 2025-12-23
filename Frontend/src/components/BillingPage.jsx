import React, { useState, useEffect } from 'react';
import MenuGrid from './MenuGrid';
import BillSummary from './BillSummary';
import PaymentModal from './PaymentModal';
import Invoice from './Invoice';
import Toast from './Toast';
import { getActiveOrder, saveOrder, generateBill, settleBill, getBills } from '../api/billing';
import { Search, UtensilsCrossed, Maximize, Minimize, TrendingUp, ShoppingBag, LayoutGrid } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';

const BillingPage = ({ initialTable, onOrderUpdate }) => {
  const [activeTable, setActiveTable] = useState(initialTable || '');
  // ... (rest of state)

  // ... (rest of code)

        {/* Table Selector */}
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-1.5">
          <LayoutGrid size={16} className="text-text-muted" />
          <select 
            value={activeTable} 
            onChange={(e) => setActiveTable(e.target.value)}
            className="bg-transparent font-bold text-text-main focus:outline-none text-sm"
          >
            <option value="">Select Table</option>
            {[...Array(20)].map((_, i) => (
              <option key={i} value={`TBL-${String(i + 1).padStart(2, '0')}`}>
                Table {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState('Open'); // Open, Billed, Paid
  const [billNumber, setBillNumber] = useState(null);
  
  const [billType, setBillType] = useState('Dine-In');
  const [taxRate, setTaxRate] = useState(''); 
  const [discount, setDiscount] = useState({ type: 'percentage', value: '' });
  
  const [showPayment, setShowPayment] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [completedBill, setCompletedBill] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dailyStats, setDailyStats] = useState({ sales: 0, orders: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch active order when table changes
  useEffect(() => {
    fetchActiveOrder();
  }, [activeTable]);

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const fetchActiveOrder = async () => {
    if (!activeTable) return;
    setLoading(true);
    try {
      const order = await getActiveOrder(activeTable);
      if (order) {
        setCart(order.items);
        setOrderId(order._id);
        setOrderStatus(order.status);
        setBillNumber(order.billNumber);
        setBillType(order.billType);
        // Restore tax/discount if needed, or keep defaults
      } else {
        // Reset for new order
        setCart([]);
        setOrderId(null);
        setOrderStatus('Open');
        setBillNumber(null);
      }
    } catch (error) {
      console.error('Error fetching active order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const bills = await getBills();
      const today = new Date().toLocaleDateString();
      const todaysBills = bills.filter(bill => new Date(bill.createdAt).toLocaleDateString() === today);
      
      const sales = todaysBills.reduce((sum, bill) => sum + bill.total, 0);
      const orders = todaysBills.length;
      
      setDailyStats({ sales, orders });
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const addToCart = (item) => {
    if (!activeTable) {
      showToast('Please select a table first', 'error');
      return;
    }
    if (orderStatus !== 'Open') {
      showToast('Order is locked. Cannot add items.', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name); // Match by name for now, ideally ID
      if (existing) {
        showToast(`Increased quantity for ${item.name}`, 'success');
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      showToast(`Added ${item.name} to order`, 'success');
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    if (!activeTable) {
      showToast('Please select a table first', 'error');
      return;
    }
    if (orderStatus !== 'Open') {
      showToast('Order is locked. Cannot modify items.', 'error');
      return;
    }
    setCart(prev => prev.map(i => {
      if (i._id === id || i.name === id) { // Handle both ID and Name matching
        const newQty = Math.max(0, i.quantity + delta);
        if (newQty === 0) showToast(`${i.name} removed from order`, 'info');
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const calculateDiscount = (subtotal) => {
    const val = discount.value === '' ? 0 : discount.value;
    if (discount.type === 'percentage') {
      return (subtotal * val) / 100;
    }
    return val;
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount(subtotal);
  const taxableAmount = subtotal - discountAmount;
  const taxVal = taxRate === '' ? 0 : taxRate;
  const taxAmount = (taxableAmount * taxVal) / 100;
  const total = taxableAmount + taxAmount;

  // Action Handlers
  const handleSaveOrder = async () => {
    if (!activeTable) {
      showToast('Please select a table first', 'error');
      return;
    }
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const orderData = {
        tableNo: activeTable,
        items: cart,
        billType
      };
      const savedOrder = await saveOrder(orderData);
      setOrderId(savedOrder._id);
      showToast('Order saved successfully!', 'success');
      fetchActiveOrder();
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error('Error saving order:', error);
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data?.details ? JSON.stringify(error.response.data.details) : '';
      showToast(`Failed to save order: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!orderId) {
      showToast('Please save the order first.', 'error');
      return;
    }
    setLoading(true);
    try {
      const billData = {
        discount: discountAmount,
        tax: taxVal
      };
      const billedOrder = await generateBill(orderId, billData);
      setOrderStatus('Billed');
      setBillNumber(billedOrder.billNumber);
      setCompletedBill(billedOrder);
      
      showToast('Bill generated successfully!', 'success');
      if (onOrderUpdate) onOrderUpdate();
      // Open Payment Modal immediately after generating bill
      setShowPayment(true);
    } catch (error) {
      console.error('Error generating bill:', error);
      
      // Graceful handling for "Order already billed" (e.g. double click or network retry)
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already billed')) {
         try {
           const order = await getActiveOrder(activeTable);
           if (order && (order.status === 'Billed' || order.status === 'Paid')) {
              setOrderStatus(order.status);
              setBillNumber(order.billNumber);
              setCompletedBill(order);
              if (order.status === 'Billed') {
                setShowPayment(true);
              } else {
                setShowInvoice(true);
              }
              showToast('Recovered existing bill status.', 'info');
              return;
           }
         } catch (fetchError) {
           console.error('Error recovering order state:', fetchError);
         }
      }

      const errorMessage = error.response?.data?.message || error.message;
      showToast(`Failed to generate bill: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleBill = (paymentData) => {
    completeSettlement(paymentData);
  };

  const completeSettlement = async (paymentData) => {
    setLoading(true);
    try {
      const settledOrder = await settleBill(orderId, { paymentMode: paymentData.mode });
      setOrderStatus('Paid');
      setShowPayment(false);
      
      // Update completed bill with paid status and details
      setCompletedBill({ ...settledOrder, items: cart }); // Ensure items are preserved
      
      showToast('Bill Settled Successfully!', 'success');
      fetchDailyStats();
      if (onOrderUpdate) onOrderUpdate();
      setShowInvoice(true); // Show Invoice AFTER payment
    } catch (error) {
      console.error('Error settling bill:', error);
      showToast('Failed to settle bill', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setShowInvoice(false);
    setCart([]);
    setOrderId(null);
    setOrderStatus('Open');
    setBillNumber(null);
    fetchActiveOrder(); // Refresh to ensure clean state
    showToast('Ready for new order', 'info');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Custom Header for Billing Page */}
      <div className="h-16 flex items-center justify-between px-6 bg-surface border-b border-border shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <UtensilsCrossed size={18} />
          </div>
          <span className="tracking-tight">RestoPOS</span>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-1.5">
          <LayoutGrid size={16} className="text-text-muted" />
          <select 
            value={activeTable} 
            onChange={(e) => setActiveTable(e.target.value)}
            className="bg-transparent font-bold text-text-main focus:outline-none text-sm"
          >
            <option value="" >Select Table</option>
            {[...Array(20)].map((_, i) => (
              <option key={i} value={`TBL-${String(i + 1).padStart(2, '0')}`}>
                Table {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 text-text-main transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-background px-3 py-1.5 rounded-xl border border-border/50">
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                Sales <TrendingUp size={10} className="text-success" />
              </p>
              <p className="text-sm font-bold text-text-main font-mono">₹{dailyStats.sales.toLocaleString()}</p>
            </div>
          </div>
          
          <button 
            onClick={toggleFullScreen}
            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 grid grid-cols-[1fr_400px] gap-4 overflow-hidden">
          {/* Left Panel: Menu */}
          <div className="flex flex-col overflow-hidden bg-surface rounded-2xl shadow-sm border border-border/50">
            <MenuGrid onSelectItem={addToCart} searchTerm={debouncedSearchTerm} />
          </div>

          {/* Right Panel: Summary */}
          <div className="flex flex-col overflow-hidden rounded-2xl shadow-xl shadow-primary/5 ring-1 ring-black/5 bg-surface">
            <BillSummary 
              cart={cart} 
              updateQuantity={updateQuantity}
              subtotal={subtotal}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              total={total}
              
              // Lifecycle Props
              orderStatus={orderStatus}
              activeTable={activeTable}
              onSaveOrder={handleSaveOrder}
              onGenerateBill={handleGenerateBill}
              onSettleBill={() => setShowPayment(true)}
              
              discount={discount}
              setDiscount={setDiscount}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              billType={billType}
              setBillType={setBillType}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          total={total} 
          onClose={() => setShowPayment(false)} 
          onComplete={handleSettleBill}
        />
      )}

      {showInvoice && (
        <Invoice 
          bill={completedBill} 
          onClose={handleFinish} 
          onSave={handleFinish} // Re-using onSave prop for "Finish" action
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default BillingPage;
