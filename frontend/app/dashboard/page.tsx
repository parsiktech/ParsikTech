"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function Dashboard() {
  const [showSummary, setShowSummary] = useState(true);
  const stats = [
    { label: "Active Requests", value: "3", status: "in-progress", color: "blue" },
    { label: "Monthly Spend", value: "$12,450", status: "on-track", color: "green" },
    { label: "Upcoming Deadlines", value: "2", status: "attention", color: "yellow" },
    { label: "Content Pending", value: "5", status: "review", color: "purple" },
  ];

  const recentRequests = [
    { id: "#REQ-1234", type: "Project Update", status: "In Progress", date: "2 hours ago", team: "Engineering" },
    { id: "#REQ-1233", type: "Marketing Report", status: "Waiting", date: "1 day ago", team: "Growth" },
    { id: "#REQ-1232", type: "New Service Request", status: "Queued", date: "2 days ago", team: "Product" },
  ];

  const upcomingDeadlines = [
    { task: "Q1 Marketing Campaign Launch", date: "Jan 15, 2026", priority: "high" },
    { task: "Website Redesign Review", date: "Jan 18, 2026", priority: "medium" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-8">
        {/* Status Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-500 font-medium text-sm md:text-base">You're on track this month</span>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">Operations Hub</h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)]">At-a-glance overview of your operations</p>
        </div>

        {/* Monthly Executive Summary */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[var(--border)] flex items-center justify-between cursor-pointer" onClick={() => setShowSummary(!showSummary)}>
            <h2 className="text-lg md:text-2xl font-bold text-[var(--text-primary)]">This Month at a Glance</h2>
            <svg
              className={`w-5 h-5 md:w-6 md:h-6 text-[var(--text-secondary)] transition-transform ${showSummary ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showSummary && (
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 md:mt-2 flex-shrink-0"></div>
                <div className="text-sm md:text-base">
                  <span className="font-medium text-[var(--text-primary)]">Completed: </span>
                  <span className="text-[var(--text-secondary)]">Q1 Marketing Campaign launched on schedule with 127% over target engagement</span>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 md:mt-2 flex-shrink-0"></div>
                <div className="text-sm md:text-base">
                  <span className="font-medium text-[var(--text-primary)]">In Progress: </span>
                  <span className="text-[var(--text-secondary)]">Website redesign in final review, tracking for Jan 18 delivery</span>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6366F1] mt-1.5 md:mt-2 flex-shrink-0"></div>
                <div className="text-sm md:text-base">
                  <span className="font-medium text-[var(--text-primary)]">What Moved the Needle: </span>
                  <span className="text-[var(--text-secondary)]">Ad spend optimization reduced CPA by 34%, freeing up $4.2K for expanded reach</span>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 md:mt-2 flex-shrink-0"></div>
                <div className="text-sm md:text-base">
                  <span className="font-medium text-[var(--text-primary)]">Next: </span>
                  <span className="text-[var(--text-secondary)]">Feb campaign planning session scheduled, new content pipeline ready for review</span>
                </div>
              </div>
              <div className="pt-3 md:pt-4 border-t border-[var(--border)] text-xs md:text-sm text-[var(--text-secondary)]">
                Updated Jan 13, 2026 • Next update: Feb 1, 2026
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[var(--card-bg)] rounded-lg p-3 md:p-6 border border-[var(--border)]">
              <div className="text-xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] mb-2 md:mb-3">{stat.label}</div>
              <div className={`inline-block px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${
                stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                stat.color === 'green' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                'bg-purple-500/10 text-purple-500 border border-purple-500/20'
              }`}>
                {stat.status}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Requests */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-2xl font-bold text-[var(--text-primary)]">Recent Requests</h2>
              <Link href="/dashboard/requests" className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm md:text-base">
                View All →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {recentRequests.map((request, i) => (
              <div key={i} className="p-3 md:p-6 hover:bg-[var(--background)] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 md:gap-4">
                    <span className="font-mono text-xs md:text-sm text-[var(--text-secondary)]">{request.id}</span>
                    <span className="font-medium text-sm md:text-base text-[var(--text-primary)]">{request.type}</span>
                  </div>
                  <span className={`self-start md:self-auto px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                    request.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    request.status === 'Waiting' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-[var(--text-secondary)]">
                  <span>{request.date}</span>
                  <span>•</span>
                  <span>{request.team}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-4 md:p-6">
          <h2 className="text-lg md:text-2xl font-bold text-[var(--text-primary)] mb-4 md:mb-6">Upcoming Deadlines</h2>
          <div className="space-y-3 md:space-y-4">
            {upcomingDeadlines.map((deadline, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 md:p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="flex items-start md:items-center gap-3 md:gap-4">
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mt-1 md:mt-0 flex-shrink-0 ${
                    deadline.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-sm md:text-base text-[var(--text-primary)]">{deadline.task}</div>
                    <div className="text-xs md:text-sm text-[var(--text-secondary)]">{deadline.date}</div>
                  </div>
                </div>
                <button className="text-[#6366F1] hover:text-[#5558E3] font-medium text-sm md:text-base self-end md:self-auto">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Link href="/dashboard/requests" className="bg-[#6366F1] hover:bg-[#5558E3] text-white p-4 md:p-6 rounded-lg transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-bold text-base md:text-lg">New Request</span>
            </div>
            <p className="text-white/80 text-xs md:text-sm">Submit a new project or service request</p>
          </Link>

          <Link href="/dashboard/billing" className="bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] p-4 md:p-6 rounded-lg transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="font-bold text-base md:text-lg text-[var(--text-primary)]">View Billing</span>
            </div>
            <p className="text-[var(--text-secondary)] text-xs md:text-sm">Check invoices and payment history</p>
          </Link>

          <Link href="/dashboard/support" className="bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] p-4 md:p-6 rounded-lg transition-all">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-bold text-base md:text-lg text-[var(--text-primary)]">Get Support</span>
            </div>
            <p className="text-[var(--text-secondary)] text-xs md:text-sm">Contact our team for assistance</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
