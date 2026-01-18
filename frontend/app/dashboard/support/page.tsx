"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Support() {
  const [ticketForm, setTicketForm] = useState(false);
  const [priority, setPriority] = useState("normal");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const supportTickets = [
    { id: "SUP-1045", subject: "Campaign Performance Questions", status: "Open", priority: "Normal", updated: "2 hours ago", assignedTo: "Sarah Johnson" },
    { id: "SUP-1044", subject: "Request for Additional Reporting", status: "In Progress", priority: "Normal", updated: "1 day ago", assignedTo: "Michael Chen" },
    { id: "SUP-1043", subject: "Dashboard Access Issue", status: "Resolved", priority: "High", updated: "3 days ago", assignedTo: "Sarah Johnson" },
  ];

  const faqItems = [
    { question: "How do I submit a new request?", answer: "Navigate to the Requests tab and click 'New Request'. You can use templates for common requests like Marketing Reports." },
    { question: "What's included in my retainer?", answer: "Your retainer includes unlimited service access for strategy, execution, and reporting. Ad spend is billed separately based on actual platform costs." },
    { question: "How quickly will I get a response?", answer: "Standard requests receive a response within 24 hours. Priority Support mode guarantees 2-hour response time for urgent matters." },
    { question: "Can I access my training materials anytime?", answer: "Yes! All SafeRoute courses and certifications are available 24/7 through the Training tab." },
  ];

  const contactMethods = [
    { method: "Email", value: "support@parsiktech.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { method: "Phone", value: "+1 (555) 123-4567", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
    { method: "Emergency", value: "Priority Support Mode", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Support Center</h1>
            <p className="text-[var(--text-secondary)]">Get help, submit tickets, and access resources</p>
          </div>
          <button
            onClick={() => setTicketForm(true)}
            className="bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Support Ticket
          </button>
        </div>

        {/* Priority Support Banner */}
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Need Urgent Help?</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Activate <span className="font-medium text-[var(--text-primary)]">Priority Support Mode</span> from the top bar for immediate assistance. We guarantee a 2-hour response time for critical issues affecting your campaigns or deadlines.
              </p>
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>2-hour response SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Direct phone support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((contact, i) => (
            <div key={i} className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 hover:border-[#6366F1]/50 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={contact.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[var(--text-secondary)] mb-1">{contact.method}</div>
                  <div className="font-medium text-[var(--text-primary)] group-hover:text-[#6366F1] transition-colors">
                    {contact.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Tickets */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Your Support Tickets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Ticket ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Subject</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Priority</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Assigned To</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {supportTickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-[var(--background)] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-mono text-sm text-[var(--text-secondary)]">{ticket.id}</td>
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        ticket.status === 'In Progress' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                        'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">{ticket.assignedTo}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{ticket.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div key={i} className="bg-[var(--background)] rounded-lg border border-[var(--border)] overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--card-bg)] transition-colors"
                >
                  <h3 className="font-medium text-[var(--text-primary)] text-left">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-[var(--text-secondary)] flex-shrink-0 ml-4 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === i && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Knowledge Base</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Browse our comprehensive library of guides, tutorials, and best practices.
                </p>
                <button className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm">
                  Browse Articles →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Video Tutorials</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Watch step-by-step videos on using your dashboard and understanding reports.
                </p>
                <button className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm">
                  Watch Tutorials →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {ticketForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--card-bg)] z-10">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">New Support Ticket</h2>
              <button
                onClick={() => setTicketForm(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="normal">Normal - Standard response time (24 hours)</option>
                  <option value="high">High - Urgent issue affecting work (4 hours)</option>
                  <option value="critical">Critical - Campaign down or major blocker (2 hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
                  <option>Technical Issue</option>
                  <option>Campaign Question</option>
                  <option>Billing Inquiry</option>
                  <option>Access Request</option>
                  <option>General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Description</label>
                <textarea
                  rows={6}
                  placeholder="Please provide detailed information about your issue..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Attachments (Optional)</label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[#6366F1]/50 transition-colors cursor-pointer">
                  <svg className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-[var(--text-secondary)] text-sm">Click to upload or drag and drop</p>
                  <p className="text-[var(--text-secondary)] text-xs mt-1">Screenshots, documents, or files up to 10MB</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setTicketForm(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-[var(--background)] text-[var(--text-primary)] font-medium hover:bg-[var(--card-bg)] transition-colors border border-[var(--border)]"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 rounded-lg bg-[#6366F1] text-white font-medium hover:bg-[#5558E3] transition-colors">
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
