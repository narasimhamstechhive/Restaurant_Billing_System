import React, { useState, useEffect, useCallback } from 'react';
import { getDailyStats } from '../api/billing';
import { 
  TrendingUp, 
  Receipt, 
  ShoppingBag, 
  DollarSign,
  RefreshCw,
  Clock,
  CreditCard,
  Wallet,
  Smartphone,
  Activity,
  Package,
  Percent,
  TrendingDown
} from 'lucide-react';
import Toast from './Toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    sales: 0, 
    orders: 0,
    averageOrderValue: 0,
    totalItems: 0,
    totalDiscount: 0,
    totalTax: 0,
    paymentMethods: [],
    activeOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastResetDate, setLastResetDate] = useState(() => {
    const today = new Date().toDateString();
    return localStorage.getItem('dashboardLastDate') || today;
  });

  // Fetch today's stats - Optimized with error handling
  const fetchTodayStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDailyStats();
      // Only update if we're still on the same day
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('dashboardLastDate') || today;
      
      if (storedDate === today) {
        setStats(data);
      } else {
        // Day changed, reset to zero
        setStats({ 
          sales: 0, 
          orders: 0,
          averageOrderValue: 0,
          totalItems: 0,
          totalDiscount: 0,
          totalTax: 0,
          paymentMethods: [],
          activeOrders: 0
        });
        localStorage.setItem('dashboardLastDate', today);
        setLastResetDate(today);
      }
    } catch (error) {
      console.error('Error fetching today stats:', error);
      setToast({ message: 'Failed to load dashboard data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if day has changed and reset if needed
  useEffect(() => {
    const checkDayChange = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('dashboardLastDate');
      
      if (storedDate !== today) {
        // Day has changed, reset stats and fetch new data
        setStats({ 
          sales: 0, 
          orders: 0,
          averageOrderValue: 0,
          totalItems: 0,
          totalDiscount: 0,
          totalTax: 0,
          paymentMethods: [],
          activeOrders: 0
        });
        localStorage.setItem('dashboardLastDate', today);
        setLastResetDate(today);
        // Fetch new day's stats
        fetchTodayStats();
      }
    };

    // Check immediately
    checkDayChange();

    // Set up interval to check every minute
    const interval = setInterval(checkDayChange, 60000);

    // Set up midnight reset
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      checkDayChange();
      // Then check every minute after midnight
      setInterval(checkDayChange, 60000);
    }, msUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, [fetchTodayStats]);

  // Update current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTodayStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTodayStats, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTodayStats]);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPaymentIcon = (mode) => {
    switch (mode) {
      case 'Cash': return <Wallet size={16} />;
      case 'UPI': return <Smartphone size={16} />;
      case 'Card': return <CreditCard size={16} />;
      default: return <CreditCard size={16} />;
    }
  };

  if (loading && stats.sales === 0 && stats.orders === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-main mb-1">Today's Dashboard</h1>
              <p className="text-sm text-text-muted">{formatDate(currentDate)}</p>
            </div>
            <div className="flex items-center gap-3 text-text-muted">
              <Clock size={18} />
              <span className="text-lg font-mono font-bold text-text-main">{formatTime(currentDate)}</span>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-5 border border-success/20 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-success" size={24} />
              </div>
            </div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
              Today's Revenue
            </h3>
            <p className="text-3xl font-bold text-text-main mb-1">
              {formatCurrency(stats.sales)}
            </p>
            <p className="text-xs text-text-muted">Real-time updates</p>
          </div>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
              Completed Orders
            </h3>
            <p className="text-3xl font-bold text-text-main mb-1">
              {stats.orders}
            </p>
            <p className="text-xs text-text-muted">Paid bills today</p>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-accent" size={24} />
              </div>
            </div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
              Avg Order Value
            </h3>
            <p className="text-3xl font-bold text-text-main mb-1">
              {formatCurrency(stats.averageOrderValue)}
            </p>
            <p className="text-xs text-text-muted">Per transaction</p>
          </div>

          {/* Active Orders */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-5 border border-secondary/20 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <Activity className="text-secondary" size={24} />
              </div>
            </div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
              Active Orders
            </h3>
            <p className="text-3xl font-bold text-text-main mb-1">
              {stats.activeOrders}
            </p>
            <p className="text-xs text-text-muted">Pending bills</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Items Sold */}
          <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Items Sold</p>
                <p className="text-2xl font-bold text-text-main">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          {/* Discount Given */}
          <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Percent className="text-success" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Discount Given</p>
                <p className="text-2xl font-bold text-text-main">{formatCurrency(stats.totalDiscount)}</p>
              </div>
            </div>
          </div>

          {/* Tax Collected */}
          <div className="bg-surface rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Receipt className="text-accent" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Tax Collected</p>
                <p className="text-2xl font-bold text-text-main">{formatCurrency(stats.totalTax)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        {stats.paymentMethods && stats.paymentMethods.length > 0 && (
          <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Payment Methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.paymentMethods.map((method, index) => {
                const totalRevenue = stats.paymentMethods.reduce((sum, m) => sum + m.revenue, 0);
                const percentage = totalRevenue > 0 ? ((method.revenue / totalRevenue) * 100).toFixed(1) : 0;
                const colors = [
                  'from-primary to-primary/60',
                  'from-secondary to-secondary/60',
                  'from-accent to-accent/60'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div key={method._id || index} className="bg-gradient-to-br from-surface to-surface-hover rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center text-white`}>
                        {getPaymentIcon(method._id)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-text-main">{method._id || 'Unknown'}</p>
                        <p className="text-xs text-text-muted">{method.count} transactions</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xl font-bold text-text-main">{formatCurrency(method.revenue)}</p>
                      <p className="text-xs text-text-muted">{percentage}% of total</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-surface rounded-xl p-5 border border-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-main mb-1">Dashboard Information</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                This dashboard shows real-time statistics for today only. The data automatically resets at midnight (00:00) 
                and starts fresh for the new day. Stats are updated every 30 seconds automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={fetchTodayStats}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Now</span>
          </button>
        </div>
      </div>

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

export default Dashboard;

