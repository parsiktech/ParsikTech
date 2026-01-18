"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Requests() {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");

  // Template fields for Marketing Report
  const [timeframe, setTimeframe] = useState("");
  const [channels, setChannels] = useState<string[]>([]);
  const [kpis, setKPIs] = useState<string[]>([]);

  const requestTemplates: any = {
    "marketing-report": {
      name: "Marketing Report",
      fields: [
        { name: "timeframe", label: "Timeframe", type: "select", options: ["Last 7 days", "Last 30 days", "Last 90 days", "Custom"], required: true },
        { name: "channels", label: "Channels", type: "multiselect", options: ["Google Ads", "Facebook", "Instagram", "LinkedIn", "Email", "Organic Search"], required: true },
        { name: "kpis", label: "KPIs Requested", type: "multiselect", options: ["Impressions", "Clicks", "CTR", "Conversions", "Cost per Conversion", "ROAS", "Engagement Rate"], required: true },
      ],
    },
    "project-update": {
      name: "Project Update",
      fields: [],
    },
    "new-service": {
      name: "New Service Request",
      fields: [],
    },
    "revision": {
      name: "Revision Request",
      fields: [],
    },
    "rush": {
      name: "Rush / Priority Request",
      fields: [],
    },
  };

  const requests = [
    { id: "#REQ-1234", type: "Project Update", status: "In Progress", submitted: "Jan 10, 2026", updated: "2 hours ago", team: "Engineering" },
    { id: "#REQ-1233", type: "Marketing Report", status: "Waiting", submitted: "Jan 9, 2026", updated: "1 day ago", team: "Growth" },
    { id: "#REQ-1232", type: "New Service Request", status: "Queued", submitted: "Jan 8, 2026", updated: "2 days ago", team: "Product" },
    { id: "#REQ-1231", type: "Revision Request", status: "Completed", submitted: "Jan 5, 2026", updated: "5 days ago", team: "Engineering" },
    { id: "#REQ-1230", type: "Rush / Priority Request", status: "Completed", submitted: "Jan 3, 2026", updated: "7 days ago", team: "Growth" },
  ];

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle request submission
    console.log({ requestType, description, priority });
    setShowNewRequest(false);
    setRequestType("");
    setDescription("");
    setPriority("normal");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">Request Management</h1>
            <p className="text-[var(--text-secondary)]">Submit and track all your project requests</p>
          </div>
          <button
            onClick={() => setShowNewRequest(true)}
            className="bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        </div>

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">New Request</h2>
                  <button
                    onClick={() => setShowNewRequest(false)}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Request Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                    required
                  >
                    <option value="">Select a type...</option>
                    <option value="project-update">Project Update</option>
                    <option value="marketing-report">Marketing Report</option>
                    <option value="new-service">New Service Request</option>
                    <option value="revision">Revision Request</option>
                    <option value="rush">Rush / Priority Request</option>
                  </select>
                </div>

                {/* Template-specific fields */}
                {requestType && requestTemplates[requestType]?.fields.length > 0 && (
                  <div className="space-y-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">Required Information</h3>
                    {requestTemplates[requestType].fields.map((field: any) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === "select" && (
                          <select
                            value={field.name === "timeframe" ? timeframe : ""}
                            onChange={(e) => field.name === "timeframe" && setTimeframe(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                            required={field.required}
                          >
                            <option value="">Select {field.label.toLowerCase()}...</option>
                            {field.options.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {field.type === "multiselect" && (
                          <div className="grid grid-cols-2 gap-2">
                            {field.options.map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[var(--card-bg)]">
                                <input
                                  type="checkbox"
                                  checked={
                                    field.name === "channels" ? channels.includes(opt) :
                                    field.name === "kpis" ? kpis.includes(opt) : false
                                  }
                                  onChange={(e) => {
                                    if (field.name === "channels") {
                                      setChannels(e.target.checked ? [...channels, opt] : channels.filter(c => c !== opt));
                                    } else if (field.name === "kpis") {
                                      setKPIs(e.target.checked ? [...kpis, opt] : kpis.filter(k => k !== opt));
                                    }
                                  }}
                                  className="w-4 h-4 text-[#6366F1]"
                                />
                                <span className="text-sm text-[var(--text-primary)]">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                    placeholder="Add any additional details or context..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Priority Level
                  </label>
                  <div className="flex gap-4">
                    {['low', 'normal', 'high', 'urgent'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={level}
                          checked={priority === level}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-4 h-4 text-[#6366F1]"
                        />
                        <span className="text-[var(--text-primary)] capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-[var(--text-secondary)] mb-2">Drop files here or click to upload</p>
                    <input type="file" multiple className="hidden" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
                    className="px-6 py-3 rounded-lg font-medium bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--card-bg)] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Request ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Submitted</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Last Updated</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Team</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {requests.map((request, i) => (
                  <tr key={i} className="hover:bg-[var(--background)] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-[var(--text-primary)]">{request.id}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{request.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        request.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        request.status === 'Waiting' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        request.status === 'Queued' ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20' :
                        'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{request.submitted}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{request.updated}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{request.team}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#6366F1] hover:text-[#5558E3] text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
