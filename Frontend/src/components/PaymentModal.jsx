import React, { useState } from 'react';
import { X, CheckCircle, Wallet, CreditCard, Banknote } from 'lucide-react';

const PaymentModal = ({ total, onClose, onComplete }) => {
  const [mode, setMode] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState(total);

  const balance = amountPaid - total;

  const getIcon = (m) => {
    switch(m) {
      case 'Cash': return <Banknote size={20} />;
      case 'Card': return <CreditCard size={20} />;
      case 'UPI': return <Wallet size={20} />;
      default: return <Banknote size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
          <h2 className="font-bold text-lg text-text-main">Complete Payment</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="text-center mb-8">
            <span className="text-text-muted text-sm uppercase tracking-wider font-semibold">Amount Due</span>
            <div className="text-4xl font-bold text-primary mt-1">₹{total.toFixed(2)}</div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-text-muted mb-3 block">Select Payment Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['Cash', 'UPI', 'Card'].map(m => (
                <button 
                  key={m}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    mode === m 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-background border-border text-text-muted hover:bg-surface-hover hover:text-text-main'
                  }`}
                  onClick={() => setMode(m)}
                >
                  {getIcon(m)}
                  <span className="text-sm font-medium">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-muted">Amount Paid</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-background border border-border rounded-xl py-3 pl-8 pr-4 text-lg font-bold text-text-main focus:outline-none focus:border-primary transition-colors"
                  value={amountPaid} 
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-border">
              <span className="font-medium text-text-muted">Balance to Return</span>
              <span className={`text-xl font-bold ${balance < 0 ? 'text-danger' : 'text-success'}`}>
                ₹{balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-surface">
          <button 
            className="w-full bg-success text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-success/20" 
            disabled={balance < 0}
            onClick={() => onComplete({ mode, amountPaid })}
          >
            <CheckCircle size={20} />
            <span>Complete Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
