import React from 'react';
import { Printer, ArrowLeft, Download, Save } from 'lucide-react';

const Invoice = ({ bill, onClose, onSave }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50 overflow-hidden animate-in fade-in duration-200 items-center justify-center p-4">
      {/* Controls - Hidden on Print */}
      <div className="absolute top-4 right-4 flex gap-3 print:hidden">
        {onSave && (
          <button 
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-full hover:bg-success-hover transition-colors font-bold shadow-lg shadow-success/20"
          >
            <Save size={18} />
            <span>Finish</span>
          </button>
        )}
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-bold shadow-lg"
        >
          <Printer size={18} />
          <span>Print</span>
        </button>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors font-medium backdrop-blur-md"
        >
          <ArrowLeft size={18} />
          <span>Close</span>
        </button>
      </div>

      {/* Receipt Preview */}
      <div className="bg-white text-black font-mono w-[380px] shadow-2xl overflow-hidden print:shadow-none print:w-[380px] print:absolute print:top-0 print:left-0">
        <div className="p-6 print:p-0">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">RestoPOS</h1>
            <p className="text-xs uppercase">123 Foodie Street, Gourmet City</p>
            <p className="text-xs uppercase">Ph: +91 98765 43210</p>
            <p className="text-xs uppercase mt-1">GSTIN: 29ABCDE1234F1Z5</p>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] mt-4 border-y-2 border-dashed border-black py-2">Receipt</h2>
          </div>

          {/* Bill Info */}
          <div className="flex justify-between text-xs uppercase mb-4 font-bold">
            <div className="text-left">
              <p>Bill No: {bill.billNumber || 'PREVIEW'}</p>
              <p>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p>Time: {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Type: {bill.billType}</p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-b-2 border-dashed border-black mb-2"></div>

          {/* Items Header */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 text-xs font-bold uppercase mb-2">
            <div className="w-8 text-center">Qty</div>
            <div>Item</div>
            <div className="text-right">Price</div>
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {bill.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[auto_1fr_auto] gap-2 text-xs uppercase">
                <div className="w-8 text-center font-bold">{item.quantity}</div>
                <div className="truncate pr-2">{item.name}</div>
                <div className="text-right">{(item.total || (item.price * item.quantity)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-b-2 border-dashed border-black mb-4"></div>

          {/* Totals */}
          <div className="space-y-1 text-xs uppercase mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{(bill.subtotal || 0).toFixed(2)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{(bill.discount || 0).toFixed(2)}</span>
              </div>
            )}
            {bill.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{(bill.tax || 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="border-t-2 border-dashed border-black pt-2 mb-6">
            <div className="flex justify-between text-xl font-bold uppercase">
              <span>Total</span>
              <span>₹{(bill.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs uppercase space-y-1">
            <p>*** Thank You! Visit Again ***</p>
            <p>For Feedback: feedback@restopos.com</p>
          </div>
          
          {/* Cut Line Visual (Screen only) */}
          <div className="mt-8 border-b-4 border-dotted border-gray-300 print:hidden relative">
             <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black/80 rounded-full"></div>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-black/80 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
