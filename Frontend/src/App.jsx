import React, { useState, useEffect } from 'react';
import BillingPage from './components/BillingPage';
import BillHistory from './components/BillHistory';
import LoginPage from './components/LoginPage';
import MenuManagement from './components/MenuManagement';
import ActiveOrders from './components/ActiveOrders';
import { LogOut, LayoutDashboard, History, User, UtensilsCrossed, ClipboardList } from 'lucide-react';
import { getOpenOrders } from './api/billing';
import './App.css';

function App() {
  const [view, setView] = useState('orders'); // Default to orders view
  const [selectedTable, setSelectedTable] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchActiveOrdersCount();
    }
  }, [user]);

  const fetchActiveOrdersCount = async () => {
    try {
      const orders = await getOpenOrders();
      setActiveOrdersCount(orders.length);
    } catch (error) {
      console.error('Error fetching active orders count:', error);
    }
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-background text-text-muted">Loading...</div>;

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const getTitle = () => {
    switch(view) {
      case 'billing': return 'New Order';
      case 'history': return 'Transaction History';
      case 'menu': return 'Menu Management';
      default: return 'RestoPOS';
    }
  };

  return (
    <div className="h-screen flex bg-background text-text-main font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface flex flex-col shrink-0 shadow-xl z-20">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3 font-bold text-xl text-primary">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <UtensilsCrossed size={22} />
            </div>
            <span className="tracking-tight">RestoPOS</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setView('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium relative ${view === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-2' : 'text-text-muted hover:bg-surface-hover hover:text-text-main hover:translate-x-1'}`}
          >
            <ClipboardList size={20} />
            <span>Active Orders</span>
            {activeOrdersCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${view === 'orders' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium ${view === 'billing' ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-2' : 'text-text-muted hover:bg-surface-hover hover:text-text-main hover:translate-x-1'}`}
          >
            <LayoutDashboard size={20} />
            <span>New Order</span>
          </button>
          <button 
            onClick={() => setView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium ${view === 'history' ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-2' : 'text-text-muted hover:bg-surface-hover hover:text-text-main hover:translate-x-1'}`}
          >
            <History size={20} />
            <span>Bill History</span>
          </button>
          
          {user.role === 'Admin' && (
            <button 
              onClick={() => setView('menu')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium ${view === 'menu' ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-2' : 'text-text-muted hover:bg-surface-hover hover:text-text-main hover:translate-x-1'}`}
            >
              <UtensilsCrossed size={20} />
              <span>Menu</span>
            </button>
          )}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-danger bg-danger/5 hover:bg-danger/10 transition-all font-medium hover:shadow-md"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Topbar */}
        {view !== 'billing' && (
          <header className="h-20 flex items-center justify-between px-8 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-text-main tracking-tight">
                {getTitle()}
              </h1>
              <p className="text-sm text-text-muted">Welcome back, {user.username}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-2 py-1.5 bg-surface rounded-full shadow-sm pr-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <User size={20} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-text-main">{user.username}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{user.role}</span>
                </div>
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-hidden p-6">
          {view === 'orders' && (
            <ActiveOrders 
              onSelectOrder={(tableNo) => {
                setSelectedTable(tableNo);
                setView('billing');
              }} 
              onOrderUpdate={fetchActiveOrdersCount}
            />
          )}
          {view === 'billing' && <BillingPage initialTable={selectedTable} onOrderUpdate={fetchActiveOrdersCount} />}
          {view === 'history' && <BillHistory />}
          {view === 'menu' && <MenuManagement />}
        </main>
      </div>
    </div>
  );
}

export default App;
