"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Update {
  id: string;
  title: string;
  content: string;
  update_type: string;
  created_at: string;
  admin_name: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_size: number;
  category: string;
  version: number;
  created_at: string;
}

interface DashboardData {
  company: {
    name: string;
    status: string;
  };
  recentUpdates: Update[];
  recentDocuments: Document[];
  unreadNotifications: number;
}

export default function ClientDashboard() {
  const { user, userType, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "updates" | "documents">("overview");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || userType !== "client")) {
      router.push("/client/login");
    }
  }, [user, userType, authLoading, router]);

  useEffect(() => {
    if (user && userType === "client") {
      loadData();
    }
  }, [user, userType, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "overview") {
        const response = await api.getClientDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data as DashboardData);
        }
      } else if (activeTab === "updates") {
        const response = await api.getClientUpdates();
        if (response.success && response.data) {
          setUpdates(response.data.updates as Update[]);
        }
      } else if (activeTab === "documents") {
        const response = await api.getClientDocuments();
        if (response.success && response.data) {
          setDocuments(response.data.documents as Document[]);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setIsLoading(false);
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await api.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/client/login");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getUpdateTypeStyle = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "deliverable":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "status":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "announcement":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Parsik<span className="text-[#6366F1]">Tech</span>
              </h1>
            </Link>
            <span className="text-[var(--text-secondary)] text-sm">Client Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[var(--text-secondary)] text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Welcome back, {user.name?.split(" ")[0]}
          </h2>
          {dashboardData?.company && (
            <p className="text-[var(--text-secondary)]">
              {dashboardData.company.name}
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                dashboardData.company.status === "active"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}>
                {dashboardData.company.status}
              </span>
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(["overview", "updates", "documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-[#6366F1] text-white"
                  : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Updates */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Updates</h3>
                <button
                  onClick={() => setActiveTab("updates")}
                  className="text-[#6366F1] text-sm hover:underline"
                >
                  View all
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-[#6366F1] border-t-transparent rounded-full" />
                </div>
              ) : dashboardData?.recentUpdates?.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-sm py-4">No updates yet.</p>
              ) : (
                <div className="space-y-4">
                  {dashboardData?.recentUpdates?.slice(0, 3).map((update) => (
                    <div key={update.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-[var(--text-primary)]">{update.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getUpdateTypeStyle(update.update_type)}`}>
                          {update.update_type}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{update.content}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-2">
                        {new Date(update.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Documents */}
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Documents</h3>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="text-[#6366F1] text-sm hover:underline"
                >
                  View all
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-[#6366F1] border-t-transparent rounded-full" />
                </div>
              ) : dashboardData?.recentDocuments?.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-sm py-4">No documents yet.</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData?.recentDocuments?.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] hover:border-[#6366F1] border border-transparent transition-colors cursor-pointer"
                      onClick={() => handleDownload(doc)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{doc.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === "updates" && (
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">All Updates</h3>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : updates.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <p className="text-[var(--text-secondary)]">No updates yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="text-lg font-semibold text-[var(--text-primary)]">{update.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUpdateTypeStyle(update.update_type)}`}>
                        {update.update_type}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{update.content}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--text-secondary)]">
                      <span>Posted by {update.admin_name}</span>
                      <span>{new Date(update.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">All Documents</h3>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <p className="text-[var(--text-secondary)]">No documents yet.</p>
              </div>
            ) : (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Document</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Category</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Size</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Date</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[var(--background)]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{doc.title}</p>
                            {doc.description && (
                              <p className="text-sm text-[var(--text-secondary)] truncate max-w-xs">{doc.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-[var(--background)] text-sm text-[var(--text-secondary)]">
                            {doc.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                          {formatFileSize(doc.file_size)}
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-[#6366F1] hover:underline text-sm flex items-center gap-1 ml-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
