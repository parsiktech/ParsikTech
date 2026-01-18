"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Content() {
  const contentItems = [
    { title: "Q1 Social Media Campaign", type: "Campaign", status: "In Review", dueDate: "Jan 15, 2026", assets: 12 },
    { title: "Email Newsletter Template", type: "Email", status: "Approved", dueDate: "Jan 12, 2026", assets: 3 },
    { title: "Blog Post: Industry Trends", type: "Blog", status: "Draft", dueDate: "Jan 20, 2026", assets: 1 },
    { title: "Product Launch Graphics", type: "Graphics", status: "In Progress", dueDate: "Jan 25, 2026", assets: 8 },
    { title: "Video Ad Script", type: "Video", status: "Awaiting Feedback", dueDate: "Jan 18, 2026", assets: 2 },
  ];

  const contentCalendar = [
    { date: "Jan 15", title: "Social Campaign Launch", type: "Social Media" },
    { date: "Jan 18", title: "Blog Post Publication", type: "Blog" },
    { date: "Jan 22", title: "Newsletter Send", type: "Email" },
    { date: "Jan 25", title: "Video Ad Launch", type: "Video" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Content Hub</h1>
          <p className="text-[var(--text-secondary)]">Manage marketing content, assets, and campaigns</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">In Production</div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">8</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">In Review</div>
            <div className="text-3xl font-bold text-[#6366F1]">3</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Approved</div>
            <div className="text-3xl font-bold text-green-500">12</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">This Month</div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">23</div>
          </div>
        </div>

        {/* Content Items */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Active Content</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {contentItems.map((item, i) => (
              <div key={i} className="p-6 hover:bg-[var(--background)] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">{item.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.assets} assets</span>
                      <span>•</span>
                      <span>Due {item.dueDate}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    item.status === 'In Review' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    item.status === 'In Progress' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                    item.status === 'Awaiting Feedback' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E3] transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--card-bg)] transition-colors border border-[var(--border)]">
                    Leave Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Calendar */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Upcoming Launches</h2>
          <div className="space-y-4">
            {contentCalendar.map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="text-center min-w-[60px]">
                  <div className="text-2xl font-bold text-[#6366F1]">{event.date.split(' ')[1]}</div>
                  <div className="text-xs text-[var(--text-secondary)] uppercase">{event.date.split(' ')[0]}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[var(--text-primary)] mb-1">{event.title}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{event.type}</div>
                </div>
                <button className="text-[#6366F1] hover:text-[#5558E3] text-sm font-medium">
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
