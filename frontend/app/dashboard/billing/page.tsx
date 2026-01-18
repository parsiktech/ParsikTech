"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Billing() {
  const invoices = [
    { id: "INV-2026-01", amount: "$5,000", status: "Paid", dueDate: "Jan 1, 2026", paidDate: "Dec 28, 2025" },
    { id: "INV-2025-12", amount: "$5,000", status: "Paid", dueDate: "Dec 1, 2025", paidDate: "Nov 28, 2025" },
    { id: "INV-2025-11", amount: "$5,000", status: "Paid", dueDate: "Nov 1, 2025", paidDate: "Oct 29, 2025" },
  ];

  const retainer = {
    monthlyAmount: "$5,000",
    adSpend: "$12,450",
    totalSpend: "$17,450",
    nextBilling: "Feb 1, 2026",
    servicePlan: "Growth Package",
  };

  const payments = [
    { date: "Dec 28, 2025", invoice: "INV-2026-01", amount: "$5,000", method: "Credit Card ****4242" },
    { date: "Nov 28, 2025", invoice: "INV-2025-12", amount: "$5,000", method: "Credit Card ****4242" },
    { date: "Oct 29, 2025", invoice: "INV-2025-11", amount: "$5,000", method: "Credit Card ****4242" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Billing & Financial Hub</h1>
          <p className="text-[var(--text-secondary)]">Manage invoices, payments, and retainer details</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Monthly Retainer</div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{retainer.monthlyAmount}</div>
            <div className="text-xs text-[var(--text-secondary)]">Unlimited service access</div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Current Ad Spend</div>
            <div className="text-3xl font-bold text-[#6366F1] mb-1">{retainer.adSpend}</div>
            <div className="text-xs text-green-500">↑ 12% from last month</div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Total Monthly Spend</div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{retainer.totalSpend}</div>
            <div className="text-xs text-[var(--text-secondary)]">Retainer + Ad Spend</div>
          </div>
        </div>

        {/* Retainer Details */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Retainer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Service Plan</span>
                  <span className="text-lg font-medium text-[var(--text-primary)]">{retainer.servicePlan}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Monthly Retainer</span>
                  <span className="text-lg font-medium text-[var(--text-primary)]">{retainer.monthlyAmount}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                  <span className="text-[var(--text-secondary)]">Next Billing Date</span>
                  <span className="text-lg font-medium text-[var(--text-primary)]">{retainer.nextBilling}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Auto-pay Status</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    Active
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[var(--background)] rounded-lg p-6 border border-[var(--border)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">What's Included</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--text-secondary)]">Unlimited project requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--text-secondary)]">Ad campaign management & optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--text-secondary)]">Priority support & dedicated team</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--text-secondary)]">Monthly performance reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#6366F1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--text-secondary)]">Strategic consulting & planning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Invoice Center */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Invoice ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Paid Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {invoices.map((invoice, i) => (
                  <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-[var(--text-primary)]">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium inline-block bg-green-500/10 text-green-500 border border-green-500/20">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{invoice.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{invoice.paidDate}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#6366F1] hover:text-[#5558E3] text-sm font-medium">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Payment History</h2>
          <div className="space-y-4">
            {payments.map((payment, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div>
                  <div className="font-medium text-[var(--text-primary)] mb-1">{payment.invoice}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{payment.date} • {payment.method}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{payment.amount}</div>
                  <button className="text-xs text-[#6366F1] hover:text-[#5558E3]">View Receipt</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Portal */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="font-medium text-[var(--text-primary)]">•••• 4242</div>
                  <div className="text-sm text-[var(--text-secondary)]">Expires 12/26</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                  Default
                </span>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <button className="w-full py-3 border-2 border-dashed border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#6366F1] transition-all">
              + Add Payment Method
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-[#6366F1]" />
              <span className="text-[var(--text-primary)]">Enable auto-pay for monthly retainer</span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
