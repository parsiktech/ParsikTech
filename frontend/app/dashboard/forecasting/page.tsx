"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Forecasting() {
  const metrics = [
    { label: "Projected Revenue (Q1)", value: "$85,000", change: "+12%", trend: "up" },
    { label: "Est. Customer Acquisition", value: "147", change: "+8%", trend: "up" },
    { label: "Predicted Conversion Rate", value: "4.2%", change: "+0.8%", trend: "up" },
    { label: "Forecasted Ad Spend", value: "$15,200", change: "-5%", trend: "down" },
  ];

  const monthlyProjections = [
    { month: "January", revenue: "$28,000", conversions: 48, spend: "$5,100" },
    { month: "February", revenue: "$29,500", conversions: 52, spend: "$4,900" },
    { month: "March", revenue: "$27,500", conversions: 47, spend: "$5,200" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Forecasting & Analytics</h1>
          <p className="text-[var(--text-secondary)]">Predictive insights and performance projections</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
              <div className="text-sm text-[var(--text-secondary)] mb-2">{metric.label}</div>
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">{metric.value}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                <svg className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {metric.change} vs last quarter
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Revenue Projection</h2>
          <div className="h-64 bg-gradient-to-br from-[#6366F1]/10 to-[#3B82F6]/5 rounded-lg flex items-center justify-center border border-[var(--border)]">
            <div className="text-center">
              <svg className="w-16 h-16 text-[#6366F1] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-[var(--text-secondary)]">Interactive chart visualization</p>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Q1 2026 Monthly Projections</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Month</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Projected Revenue</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Est. Conversions</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Planned Ad Spend</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {monthlyProjections.map((proj, i) => (
                  <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{proj.month}</td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">{proj.revenue}</td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">{proj.conversions}</td>
                    <td className="px-6 py-4 text-[var(--text-primary)]">{proj.spend}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        High
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Key Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <p className="text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">Strong momentum: </span>
                Current trajectory shows 12% revenue growth vs Q4 2025, driven by improved conversion rates and optimized ad spend.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">Opportunity identified: </span>
                February shows highest projected conversion rate (5.1%), suggesting ideal timing for product launches or promotions.
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
              <p className="text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">Efficiency gains: </span>
                Reduced ad spend forecast (-5%) while maintaining growth indicates improved cost per acquisition and targeting effectiveness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
