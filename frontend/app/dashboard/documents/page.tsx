"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Documents() {
  const documents = [
    { name: "Q1 2026 Marketing Report.pdf", type: "Report", date: "Jan 10, 2026", size: "2.4 MB", category: "Marketing" },
    { name: "Website Redesign Proposal.pdf", type: "Proposal", date: "Jan 8, 2026", size: "1.8 MB", category: "Design" },
    { name: "Monthly Retainer Agreement.pdf", type: "Contract", date: "Dec 1, 2025", size: "456 KB", category: "Legal" },
    { name: "Brand Guidelines v2.pdf", type: "Guidelines", date: "Nov 15, 2025", size: "3.2 MB", category: "Brand" },
    { name: "Analytics Dashboard Access.pdf", type: "Access", date: "Nov 1, 2025", size: "124 KB", category: "Technical" },
  ];

  const categories = ["All", "Marketing", "Design", "Legal", "Brand", "Technical"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Documents</h1>
            <p className="text-[var(--text-secondary)]">Access contracts, reports, and shared files</p>
          </div>
          <button className="bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] transition-all border border-[var(--border)]"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, i) => (
            <div key={i} className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 hover:border-[#6366F1]/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--text-primary)] mb-1 truncate group-hover:text-[#6366F1] transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {doc.date}
                </div>
                <button className="text-[#6366F1] hover:text-[#5558E3] text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
              <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium">Q1 2026 Marketing Report uploaded</p>
                <p className="text-sm text-[var(--text-secondary)]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border)]">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium">Website Redesign Proposal approved</p>
                <p className="text-sm text-[var(--text-secondary)]">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-medium">Brand Guidelines v2 viewed</p>
                <p className="text-sm text-[var(--text-secondary)]">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
