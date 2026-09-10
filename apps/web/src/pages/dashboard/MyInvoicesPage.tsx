import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FileText, Printer, Download, Eye, Loader2, X, Receipt } from "lucide-react";
import { dashboardService, GuestInvoice } from "../../services/dashboard.service";

export default function MyInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<GuestInvoice | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myInvoices"],
    queryFn: () => dashboardService.getMyInvoices(),
  });

  const invoices = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#183C32]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-[#183C32]">Invoices & Receipts</h2>
        <p className="text-xs text-[#1C1C1A]/60 mt-0.5">Download official GST tax invoices and payment receipts for your stays.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#D9C7A3]/30 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#D9C7A3]/20 text-[#183C32] flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6 text-[#183C32]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#183C32]">No Invoices Issued Yet</h3>
          <p className="text-xs text-[#1C1C1A]/60 mt-1">Invoices are automatically generated as soon as a booking payment is confirmed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D9C7A3]/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3EA] text-[#183C32] font-semibold uppercase tracking-wider text-[11px] border-b border-[#D9C7A3]/30">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Booking Details</th>
                  <th className="px-5 py-3.5">Tax (GST)</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9C7A3]/20">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F7F3EA]/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-medium text-[#183C32]">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4 text-[#1C1C1A]/70">{format(new Date(inv.issuedAt), "dd MMM yyyy")}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#183C32]">{inv.booking?.room?.name || "Suite Reservation"}</p>
                      <span className="text-[11px] text-[#1C1C1A]/50">Ref: {inv.booking?.confirmationNumber}</span>
                    </td>
                    <td className="px-5 py-4 text-[#1C1C1A]/70">₹{Number(inv.tax).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 font-bold text-[#183C32]">₹{Number(inv.total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9C7A3] text-xs font-medium text-[#183C32] hover:bg-[#F7F3EA] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 border border-[#D9C7A3]/40 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D9C7A3]/30 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#183C32]">HOTEL NEWLANDS SHIMLA</h3>
                <p className="text-[11px] text-[#1C1C1A]/60">The Mall Road, Shimla, Himachal Pradesh 171001 • GSTIN: 02AAACN1234F1Z5</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#1C1C1A]/50 block">Billed To:</span>
                <p className="font-semibold text-[#183C32] mt-0.5">Valued Hotel Guest</p>
                <p className="text-[#1C1C1A]/70">Booking: {selectedInvoice.booking?.confirmationNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#1C1C1A]/50 block">Invoice Number</span>
                <p className="font-mono font-bold text-[#183C32]">{selectedInvoice.invoiceNumber}</p>
                <p className="text-[11px] text-[#1C1C1A]/60">Date: {format(new Date(selectedInvoice.issuedAt), "dd MMMM yyyy")}</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-[#D9C7A3]/30 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F3EA] text-[#183C32] font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Rate</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9C7A3]/20">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((it) => (
                      <tr key={it.id}>
                        <td className="px-4 py-3">{it.description}</td>
                        <td className="px-4 py-3 text-center">{it.quantity}</td>
                        <td className="px-4 py-3 text-right">₹{Number(it.unitPrice).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-right">₹{Number(it.amount).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3">{selectedInvoice.booking?.room?.name || "Suite Accommodation"}</td>
                      <td className="px-4 py-3 text-center">1</td>
                      <td className="px-4 py-3 text-right">₹{Number(selectedInvoice.subtotal).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-right">₹{Number(selectedInvoice.subtotal).toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-[#1C1C1A]/70">
                  <span>Subtotal:</span>
                  <span>₹{Number(selectedInvoice.subtotal).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#1C1C1A]/70">
                  <span>GST (18%):</span>
                  <span>₹{Number(selectedInvoice.tax).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#183C32] pt-2 border-t border-[#D9C7A3]/40">
                  <span>Total Paid:</span>
                  <span>₹{Number(selectedInvoice.total).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#D9C7A3]/30">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#183C32] text-[#F7F3EA] text-xs font-medium hover:bg-[#315C4A]"
              >
                <Printer className="w-4 h-4" /> Print Official Tax Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
