"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Training() {
  const activeCourses = [
    { title: "Advanced Google Ads Certification", progress: 68, modules: 12, completed: 8, dueDate: "Jan 20, 2026", platform: "SafeRoute" },
    { title: "Content Marketing Strategy", progress: 45, modules: 8, completed: 4, dueDate: "Jan 25, 2026", platform: "SafeRoute" },
    { title: "Analytics & Data Interpretation", progress: 92, modules: 10, completed: 9, dueDate: "Jan 15, 2026", platform: "SafeRoute" },
  ];

  const completedCertifications = [
    { title: "Google Analytics 4 Certification", completedDate: "Dec 15, 2025", credential: "GA4-2025-1234", platform: "SafeRoute" },
    { title: "Facebook Ads Professional", completedDate: "Nov 28, 2025", credential: "FB-2025-5678", platform: "SafeRoute" },
    { title: "SEO Fundamentals", completedDate: "Oct 10, 2025", credential: "SEO-2025-9012", platform: "SafeRoute" },
  ];

  const upcomingTraining = [
    { title: "Q1 Marketing Strategy Workshop", date: "Jan 22, 2026", type: "Live Workshop", duration: "2 hours" },
    { title: "New Platform Features Training", date: "Jan 28, 2026", type: "Webinar", duration: "1 hour" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Training & Development</h1>
            <p className="text-[var(--text-secondary)]">Access courses, certifications, and learning resources</p>
          </div>
          <a
            href="https://saferoute.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Launch SafeRoute
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Active Courses</div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">3</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Completed</div>
            <div className="text-3xl font-bold text-green-500">12</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Certifications</div>
            <div className="text-3xl font-bold text-[#6366F1]">3</div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
            <div className="text-sm text-[var(--text-secondary)] mb-2">Learning Hours</div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">47</div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Active Courses</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {activeCourses.map((course, i) => (
              <div key={i} className="p-6 hover:bg-[var(--background)] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <span>{course.completed}/{course.modules} modules</span>
                      <span>•</span>
                      <span>Due {course.dueDate}</span>
                      <span>•</span>
                      <span className="text-[#6366F1]">{course.platform}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#5558E3] transition-colors">
                    Continue
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Progress</span>
                    <span className="font-medium text-[var(--text-primary)]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-[var(--background)] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#6366F1] h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Certifications */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Earned Certifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {completedCertifications.map((cert, i) => (
              <div key={i} className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-6 hover:border-green-500/50 transition-all group cursor-pointer">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--text-primary)] mb-1 group-hover:text-green-500 transition-colors">{cert.title}</h3>
                    <div className="text-xs text-[var(--text-secondary)] mb-2">
                      Completed {cert.completedDate}
                    </div>
                    <div className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--border)]">
                      {cert.credential}
                    </div>
                  </div>
                </div>
                <button className="w-full text-green-500 hover:text-green-400 text-sm font-medium text-center">
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Training */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingTraining.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary)] mb-1">{session.title}</div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <span>{session.date}</span>
                      <span>•</span>
                      <span>{session.type}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-[var(--background)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--card-bg)] transition-colors border border-[var(--border)]">
                  Add to Calendar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Recommendation */}
        <div className="bg-gradient-to-br from-[#6366F1]/10 to-[#3B82F6]/5 rounded-lg border border-[#6366F1]/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#6366F1] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Recommended Learning Path</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Based on your current projects and goals, we recommend completing the <span className="font-medium text-[var(--text-primary)]">Advanced Google Ads Certification</span> by Jan 20 to optimize your Q1 campaign performance. This will enable better budget allocation and targeting strategies.
              </p>
              <button className="px-6 py-2 rounded-lg bg-[#6366F1] text-white font-medium hover:bg-[#5558E3] transition-colors">
                View Full Learning Path
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
