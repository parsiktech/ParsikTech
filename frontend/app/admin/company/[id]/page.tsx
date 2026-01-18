"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

interface Company {
  id: string;
  name: string;
  status: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  notes: string;
  created_at: string;
}

interface Client {
  id: string;
  email: string;
  name: string;
  company_id: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  action: string;
  user_name: string;
  user_email: string;
  ip_address: string | null;
  created_at: string;
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, userType, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"overview" | "access" | "activity">("overview");

  // Edit form
  const [editForm, setEditForm] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || userType !== "admin")) {
      router.push("/admin/login");
    }
  }, [user, userType, authLoading, router]);

  useEffect(() => {
    if (user && userType === "admin" && resolvedParams.id) {
      loadCompanyData();
    }
  }, [user, userType, resolvedParams.id]);

  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      const [companyRes, clientsRes, activityRes] = await Promise.all([
        api.getCompany(resolvedParams.id),
        api.getClients({ companyId: resolvedParams.id }),
        api.getActivityFeed({ companyId: resolvedParams.id, limit: 20 }),
      ]);

      if (companyRes.success && companyRes.data) {
        const companyData = companyRes.data.company as Company;
        setCompany(companyData);
        setEditForm({
          name: companyData.name || "",
          ownerName: companyData.owner_name || "",
          ownerEmail: companyData.owner_email || "",
          ownerPhone: companyData.owner_phone || "",
          notes: companyData.notes || "",
        });
      }
      if (clientsRes.success && clientsRes.data) {
        setClients(clientsRes.data.clients as Client[]);
      }
      if (activityRes.success && activityRes.data) {
        setActivities(activityRes.data.activities as Activity[]);
      }
    } catch (error) {
      console.error("Failed to load company data:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormMessage(null);

    try {
      const response = await api.updateCompany(resolvedParams.id, editForm);
      if (response.success) {
        setFormMessage({ type: "success", text: "Company updated successfully" });
        setIsEditing(false);
        loadCompanyData();
      } else {
        setFormMessage({ type: "error", text: response.message || "Failed to update company" });
      }
    } catch {
      setFormMessage({ type: "error", text: "An error occurred" });
    }
    setIsSaving(false);
  };

  const handleStatusChange = async (newStatus: "active" | "paused" | "archived") => {
    const response = await api.updateCompanyStatus(resolvedParams.id, newStatus);
    if (response.success) {
      loadCompanyData();
      setFormMessage({ type: "success", text: `Company status changed to ${newStatus}` });
    }
  };

  const handleToggleClient = async (clientId: string, isActive: boolean) => {
    const response = await api.toggleClientStatus(clientId, !isActive);
    if (response.success) {
      loadCompanyData();
      setFormMessage({ type: "success", text: `Client ${isActive ? "disabled" : "enabled"} successfully` });
    }
  };

  const handleResendInvite = async (companyId: string, email: string) => {
    const response = await api.resendInvite(companyId, email);
    if (response.success) {
      setFormMessage({ type: "success", text: "Invitation sent successfully" });
      loadCompanyData();
    } else {
      setFormMessage({ type: "error", text: response.message || "Failed to send invitation" });
    }
  };

  const handleResetPassword = async (clientId: string) => {
    if (!confirm("Are you sure you want to reset this client's password? They will receive an email with instructions.")) return;

    const response = await api.resetClientPassword(clientId);
    if (response.success) {
      setFormMessage({ type: "success", text: "Password reset email sent" });
    } else {
      setFormMessage({ type: "error", text: response.message || "Failed to reset password" });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const formatActivityAction = (action: string) => {
    const actionLabels: Record<string, string> = {
      login: "Logged in",
      logout: "Logged out",
      document_download: "Downloaded document",
      document_upload: "Uploaded document",
      update_create: "Created update",
      client_invite_accept: "Accepted invitation",
    };
    return actionLabels[action] || action.replace(/_/g, " ");
  };

  if (authLoading || !user || isLoading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  Parsik<span className="text-[#6366F1]">Tech</span>
                </h1>
              </Link>
              <span className="text-[var(--text-secondary)] text-sm">Admin Portal</span>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Company Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-6">The company you're looking for doesn't exist or has been deleted.</p>
          <Link href="/admin/dashboard" className="text-[#6366F1] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Parsik<span className="text-[#6366F1]">Tech</span>
              </h1>
            </Link>
            <span className="text-[var(--text-secondary)] text-sm">Admin Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[var(--text-secondary)] text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/admin/dashboard" className="text-[var(--text-secondary)] hover:text-[#6366F1]">
            Dashboard
          </Link>
          <span className="text-[var(--text-secondary)]">/</span>
          <Link href="/admin/dashboard" className="text-[var(--text-secondary)] hover:text-[#6366F1]">
            Clients
          </Link>
          <span className="text-[var(--text-secondary)]">/</span>
          <span className="text-[var(--text-primary)]">{company.name}</span>
        </div>

        {/* Company Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{company.name}</h1>
            <div className="flex items-center gap-3">
              <select
                value={company.status}
                onChange={(e) => handleStatusChange(e.target.value as "active" | "paused" | "archived")}
                className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                  company.status === "active"
                    ? "bg-green-500/10 text-green-400"
                    : company.status === "paused"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
              <span className="text-[var(--text-secondary)] text-sm">
                Created {new Date(company.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {formMessage && (
          <div className={`mb-6 p-4 rounded-lg ${formMessage.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
            {formMessage.text}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
          {(["overview", "access", "activity"] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-3 font-medium transition-colors capitalize border-b-2 -mb-px ${
                activeSection === section
                  ? "text-[#6366F1] border-[#6366F1]"
                  : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]"
              }`}
            >
              {section === "access" ? "Client Access" : section}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Company Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateCompany} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Company Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={editForm.ownerName}
                        onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Owner Email</label>
                      <input
                        type="email"
                        value={editForm.ownerEmail}
                        onChange={(e) => setEditForm({ ...editForm, ownerEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Owner Phone</label>
                      <input
                        type="tel"
                        value={editForm.ownerPhone}
                        onChange={(e) => setEditForm({ ...editForm, ownerPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Internal Notes (Private)</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1] resize-none"
                      placeholder="Add notes about this company..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Company Name</p>
                    <p className="text-[var(--text-primary)] font-medium">{company.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Owner Name</p>
                    <p className="text-[var(--text-primary)] font-medium">{company.owner_name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Owner Email</p>
                    <p className="text-[var(--text-primary)] font-medium">{company.owner_email || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Owner Phone</p>
                    <p className="text-[var(--text-primary)] font-medium">{company.owner_phone || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Account Created</p>
                    <p className="text-[var(--text-primary)] font-medium">{formatDate(company.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Last Client Login</p>
                    <p className="text-[var(--text-primary)] font-medium">
                      {clients.length > 0 && clients.some(c => c.last_login_at)
                        ? formatDate(clients.reduce((latest, c) => {
                            if (!c.last_login_at) return latest;
                            if (!latest) return c.last_login_at;
                            return new Date(c.last_login_at) > new Date(latest) ? c.last_login_at : latest;
                          }, null as string | null))
                        : "Never"
                      }
                    </p>
                  </div>
                  {company.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-[var(--text-secondary)]">Internal Notes</p>
                      <p className="text-[var(--text-primary)] whitespace-pre-wrap">{company.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Access Section */}
        {activeSection === "access" && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Client Accounts</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Manage login credentials and access for this company's client accounts.
                </p>
              </div>

              {clients.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">No client accounts for this company.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {clients.map((client) => (
                    <div key={client.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{client.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{client.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-secondary)]">
                            <span>Created: {formatDate(client.created_at)}</span>
                            <span>Last login: {formatDate(client.last_login_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.is_active
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {client.is_active ? "Active" : "Disabled"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                        <button
                          onClick={() => handleToggleClient(client.id, client.is_active)}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            client.is_active
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          }`}
                        >
                          {client.is_active ? "Disable Access" : "Enable Access"}
                        </button>
                        <button
                          onClick={() => handleResetPassword(client.id)}
                          className="px-3 py-1.5 text-sm rounded-lg font-medium bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-colors"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleResendInvite(id, client.email)}
                          className="px-3 py-1.5 text-sm rounded-lg font-medium bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-colors"
                        >
                          Resend Invite
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Section */}
        {activeSection === "activity" && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-6 border-b border-[var(--border)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
              </div>

              {activities.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[var(--text-secondary)]">No activity recorded for this company.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] text-sm">
                            <span className="font-medium">{activity.user_name || activity.user_email}</span>
                            {" "}
                            {formatActivityAction(activity.action)}
                          </p>
                          {activity.ip_address && (
                            <p className="text-xs text-[var(--text-secondary)]">IP: {activity.ip_address}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
