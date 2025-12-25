import React from 'react';
import { Printer, ArrowLeft, Download, Save } from 'lucide-react';

// Helper function to convert number to words
const convertToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convertHundreds = (n) => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result.trim();
  };
  
  let words = '';
  const numStr = num.toFixed(2);
  const parts = numStr.split('.');
  const rupees = parseInt(parts[0]);
  const paise = parseInt(parts[1]);
  
  if (rupees >= 10000000) {
    words += convertHundreds(Math.floor(rupees / 10000000)) + 'Crore ';
    rupees %= 10000000;
  }
  if (rupees >= 100000) {
    words += convertHundreds(Math.floor(rupees / 100000)) + 'Lakh ';
    rupees %= 100000;
  }
  if (rupees >= 1000) {
    words += convertHundreds(Math.floor(rupees / 1000)) + 'Thousand ';
    rupees %= 1000;
  }
  if (rupees > 0) {
    words += convertHundreds(rupees);
  }
  
  if (paise > 0) {
    words += ' and ' + convertHundreds(paise) + 'Paise';
  }
  
  return words.trim() || 'Zero';
};

const Invoice = ({ bill, onClose, onSave }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50 overflow-hidden animate-in fade-in duration-200 items-center justify-center p-4 print:p-0.5">
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
      <div className="receipt-print bg-white text-black font-mono w-full max-w-2xl shadow-2xl print:shadow-none border-2 border-black m-10 print:m-0.5 print:max-w-none overflow-hidden">
        <div className="p-8 print:p-6">
          {/* Header Section */}
          <div className="text-center mb-6 border-b-4 border-black pb-5 relative">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-black"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-black"></div>
            
            <div className="mb-3 px-4">
              <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-2 leading-tight">RestoPOS</h1>
              <div className="w-24 h-1.5 bg-black mx-auto mb-1"></div>
              <div className="w-16 h-0.5 bg-gray-600 mx-auto"></div>
            </div>
            <div className="space-y-1.5 mt-4">
              <p className="text-sm font-bold uppercase tracking-wide">123 Foodie Street, Gourmet City - 560001</p>
              <p className="text-xs font-semibold">📞 +91 98765 43210 | ✉️ info@restopos.com</p>
              <p className="text-xs font-semibold mt-2 bg-black text-white px-3 py-1 inline-block">GSTIN: 29ABCDE1234F1Z5</p>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-5 relative">
            <div className="absolute left-0 top-1/2 w-1/4 h-0.5 bg-black"></div>
            <h2 className="text-2xl font-bold uppercase tracking-[0.4em] border-y-2 border-black py-3 px-6 inline-block bg-gray-50">TAX INVOICE</h2>
            <div className="absolute right-0 top-1/2 w-1/4 h-0.5 bg-black"></div>
          </div>

          {/* Bill Information Section */}
          <div className="mb-5 space-y-3 bg-gray-50 p-3 border-2 border-dashed border-gray-400">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Bill No:</span>
                  <span className="font-extrabold text-base">{bill.billNumber || 'PREVIEW'}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Date:</span>
                  <span className="font-semibold">{new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Time:</span>
                  <span className="font-semibold">{new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Items:</span>
                  <span className="font-semibold">{bill.items?.length || 0} {bill.items?.length === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Type:</span>
                  <span className="font-semibold uppercase bg-black text-white px-2 py-0.5 text-xs">{bill.billType}</span>
                </div>
                {bill.tableNo && (
                  <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                    <span className="font-bold uppercase text-xs">Table No:</span>
                    <span className="font-semibold text-base">{bill.tableNo}</span>
                  </div>
                )}
                {bill.customerName && (
                  <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                    <span className="font-bold uppercase text-xs">Customer:</span>
                    <span className="font-semibold">{bill.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-dashed border-gray-500 pb-1.5">
                  <span className="font-bold uppercase text-xs">Invoice ID:</span>
                  <span className="font-semibold text-xs">{bill._id?.slice(-8) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-b-2 border-black mb-4"></div>

          {/* Items Section Header */}
          <div className="grid grid-cols-[50px_2fr_1fr_1fr] gap-3 text-xs font-extrabold uppercase mb-2 pb-2.5 border-b-4 border-black bg-gray-100 px-2 py-2">
            <div className="text-center">Qty</div>
            <div>Item Name</div>
            <div className="text-right">Rate (₹)</div>
            <div className="text-right">Amount (₹)</div>
          </div>

          {/* Items List */}
          <div className="mb-4">
            {bill.items && bill.items.length > 0 ? (
              bill.items.map((item, idx) => {
                const itemTotal = item.total || (item.price * item.quantity) || 0;
                const itemPrice = item.price || 0;
                return (
                  <div key={idx} className="grid grid-cols-[50px_2fr_1fr_1fr] gap-3 text-sm border-b border-dashed border-gray-400 py-2.5 mb-1 hover:bg-gray-50 transition-colors">
                    <div className="text-center font-bold text-base">{item.quantity || 0}</div>
                    <div className="break-words leading-tight font-semibold">{item.name || 'Unknown Item'}</div>
                    <div className="text-right font-semibold">₹{itemPrice.toFixed(2)}</div>
                    <div className="text-right font-bold text-base">₹{itemTotal.toFixed(2)}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-center text-gray-500 py-4 border-b border-dashed border-gray-300">No items found</div>
            )}
          </div>
          
          {/* Items Summary */}
          {bill.items && bill.items.length > 0 && (
            <div className="mb-4 text-xs text-right text-gray-600 italic">
              Total Items: {bill.items.reduce((sum, item) => sum + (item.quantity || 0), 0)} units
            </div>
          )}

          {/* Separator Line */}
          <div className="border-b-2 border-black mb-4"></div>

          {/* Calculation Section */}
          <div className="space-y-2.5 mb-4 bg-gray-50 p-3 border-2 border-dashed border-gray-400">
            <div className="flex justify-between text-sm border-b-2 border-dashed border-gray-500 pb-2">
              <span className="font-bold uppercase">Subtotal:</span>
              <span className="font-bold text-base">₹{(bill.subtotal || 0).toFixed(2)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-sm border-b-2 border-dashed border-gray-500 pb-2">
                <span className="font-bold uppercase text-green-700">Discount ({((bill.discount / (bill.subtotal || 1)) * 100).toFixed(1)}%):</span>
                <span className="font-bold text-green-700 text-base">-₹{(bill.discount || 0).toFixed(2)}</span>
              </div>
            )}
            {bill.tax > 0 && (
              <>
                <div className="flex justify-between text-xs border-b border-dashed border-gray-400 pb-1 pt-1">
                  <span className="font-semibold uppercase text-gray-600">CGST (9%):</span>
                  <span className="font-semibold text-gray-600">₹{((bill.tax || 0) / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs border-b border-dashed border-gray-400 pb-1">
                  <span className="font-semibold uppercase text-gray-600">SGST (9%):</span>
                  <span className="font-semibold text-gray-600">₹{((bill.tax || 0) / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-b-2 border-dashed border-gray-500 pb-2 pt-1">
                  <span className="font-bold uppercase">Total Tax (GST):</span>
                  <span className="font-bold text-base">₹{(bill.tax || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Total Section */}
          <div className="border-t-4 border-b-4 border-black py-4 mb-4 bg-black text-white px-4 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xl font-extrabold uppercase tracking-wider">Grand Total:</span>
              <span className="text-3xl font-extrabold">₹{(bill.total || 0).toFixed(2)}</span>
            </div>
            {bill.paymentMode && (
              <div className="mt-4 pt-4 border-t-2 border-dashed border-white/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase">Payment Mode:</span>
                  <span className="text-base font-bold uppercase bg-white text-black px-4 py-1.5 border-2 border-white">{bill.paymentMode}</span>
                </div>
                {bill.paidAmount && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-semibold uppercase">Paid Amount:</span>
                    <span className="text-sm font-bold">₹{(bill.paidAmount || 0).toFixed(2)}</span>
                  </div>
                )}
                {bill.changeAmount && bill.changeAmount > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-semibold uppercase">Change:</span>
                    <span className="text-sm font-bold text-green-300">₹{(bill.changeAmount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount in Words */}
          <div className="mb-4 p-3 bg-gray-50 border-2 border-dashed border-gray-500">
            <p className="text-xs font-bold uppercase mb-1">Amount in Words:</p>
            <p className="text-sm font-semibold italic border-t border-dashed border-gray-400 pt-2">
              {convertToWords(bill.total || 0)} Rupees Only
            </p>
          </div>
          
          {/* QR Code Placeholder */}
          <div className="mb-4 text-center border-2 border-dashed border-gray-400 p-4 bg-gray-50">
            <div className="text-xs font-bold uppercase mb-2">Scan for Digital Receipt</div>
            <div className="w-32 h-32 border-2 border-gray-400 mx-auto flex items-center justify-center bg-white">
              <div className="text-xs text-gray-500 text-center px-2">
                QR Code<br/>Placeholder
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">Invoice ID: {bill._id?.slice(-12) || 'N/A'}</div>
          </div>

          {/* Footer Section */}
          <div className="text-center space-y-2 mt-6 pt-4 border-t-4 border-dashed border-black relative">
            {/* Decorative line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-black"></div>
            
            <div className="space-y-1.5">
              <p className="text-base font-extrabold uppercase tracking-wider">*** Thank You For Your Visit! ***</p>
              <p className="text-xs font-semibold italic">We hope to serve you again soon</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-dashed border-gray-400 space-y-1">
              <p className="text-xs font-semibold">📧 For Feedback: feedback@restopos.com</p>
              <p className="text-xs font-semibold">🌐 www.restopos.com | 📱 +91 98765 43210</p>
            </div>
            
            <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-500">
              <p className="text-xs font-bold uppercase text-gray-600">This is a Computer Generated Invoice</p>
              <p className="text-xs font-medium text-gray-500 mt-1">No Signature Required | Valid for Tax Purposes</p>
            </div>
            
            {/* Bottom decorative line */}
            <div className="mt-4 pt-2 border-t border-gray-300">
              <p className="text-xs text-gray-400">Generated on {new Date().toLocaleString('en-IN')}</p>
            </div>
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
