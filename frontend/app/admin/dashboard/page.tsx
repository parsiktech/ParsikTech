"use client";

import { useState, useEffect } from "react";
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
  created_at: string;
  account_email?: string;
  pending_invite_email?: string;
}

interface Client {
  id: string;
  email: string;
  name: string;
  company_id: string;
  company_name: string;
  is_active: boolean;
  last_login_at: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  update_type: string;
  is_global: boolean;
  company_id: string | null;
  company_name: string | null;
  created_by_name: string;
  published_at: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  category: string;
  version: number;
  company_id: string;
  company_name: string;
  uploaded_by_name: string;
  uploaded_at: string;
  download_count: number;
}

interface Activity {
  id: string;
  user_id: string;
  user_type: string;
  company_id: string | null;
  company_name: string | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, userType, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"clients" | "updates" | "documents" | "activity" | "security">("clients");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityFilter, setActivityFilter] = useState({ companyId: "", eventType: "" });
  const [securityData, setSecurityData] = useState<{ loginHistory: Activity[]; multipleIpUsers: { user_id: string; user_type: string; unique_ips: number; ip_addresses: string[] }[] }>({ loginHistory: [], multipleIpUsers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Combined form for company + client
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    clientName: "",
    clientEmail: "",
    sendInvite: true,
  });

  // Update form
  const [updateForm, setUpdateForm] = useState({
    title: "",
    content: "",
    updateType: "general" as "general" | "status" | "deliverable" | "announcement" | "urgent",
    companyId: "",
    isGlobal: true,
  });

  // Document form
  const [documentForm, setDocumentForm] = useState({
    title: "",
    description: "",
    category: "other" as "report" | "contract" | "deliverable" | "invoice" | "other",
    companyId: "",
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || userType !== "admin")) {
      router.push("/admin/login");
    }
  }, [user, userType, authLoading, router]);

  useEffect(() => {
    if (user && userType === "admin") {
      loadData();
    }
  }, [user, userType, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "clients") {
        const [companiesRes, clientsRes] = await Promise.all([
          api.getCompanies(),
          api.getClients(),
        ]);
        if (companiesRes.success && companiesRes.data) {
          setCompanies(companiesRes.data.companies as Company[]);
        }
        if (clientsRes.success && clientsRes.data) {
          setClients(clientsRes.data.clients as Client[]);
        }
      } else if (activeTab === "updates") {
        const [updatesRes, companiesRes] = await Promise.all([
          api.getUpdates(),
          api.getCompanies(),
        ]);
        if (updatesRes.success && updatesRes.data) {
          setUpdates(updatesRes.data as Update[]);
        }
        if (companiesRes.success && companiesRes.data) {
          setCompanies(companiesRes.data.companies as Company[]);
        }
      } else if (activeTab === "documents") {
        const [documentsRes, companiesRes] = await Promise.all([
          api.getDocuments(),
          api.getCompanies(),
        ]);
        if (documentsRes.success && documentsRes.data) {
          setDocuments(documentsRes.data as Document[]);
        }
        if (companiesRes.success && companiesRes.data) {
          setCompanies(companiesRes.data.companies as Company[]);
        }
      } else if (activeTab === "activity") {
        const [activityRes, companiesRes] = await Promise.all([
          api.getActivityFeed({
            companyId: activityFilter.companyId || undefined,
            eventType: activityFilter.eventType || undefined,
            limit: 100,
          }),
          api.getCompanies(),
        ]);
        if (activityRes.success && activityRes.data) {
          setActivities(activityRes.data.activities as Activity[]);
        }
        if (companiesRes.success && companiesRes.data) {
          setCompanies(companiesRes.data.companies as Company[]);
        }
      } else if (activeTab === "security") {
        const securityRes = await api.getSecurityActivity({ limit: 100 });
        if (securityRes.success && securityRes.data) {
          setSecurityData({
            loginHistory: securityRes.data.loginHistory as Activity[],
            multipleIpUsers: securityRes.data.multipleIpUsers as { user_id: string; user_type: string; unique_ips: number; ip_addresses: string[] }[],
          });
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateCompanyAndClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const companyRes = await api.createCompany({
        name: form.companyName,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        ownerPhone: form.ownerPhone,
      });

      if (!companyRes.success || !companyRes.data) {
        setFormError(companyRes.message || "Failed to create company");
        setIsSubmitting(false);
        return;
      }

      // Response data is the company object directly
      const companyData = companyRes.data as { id?: string };
      const companyId = companyData.id;

      if (!companyId) {
        setFormError("Failed to get company ID from response");
        setIsSubmitting(false);
        return;
      }

      const clientRes = await api.createClient({
        companyId: companyId,
        name: form.clientName,
        email: form.clientEmail,
        sendInvite: form.sendInvite,
      });

      if (!clientRes.success) {
        setFormError(clientRes.message || "Company created but failed to create client account");
        setIsSubmitting(false);
        loadData();
        return;
      }

      setShowCreateModal(false);
      setForm({
        companyName: "",
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        clientName: "",
        clientEmail: "",
        sendInvite: true,
      });
      loadData();
    } catch (err) {
      console.error("Create company/client error:", err);
      setFormError("An error occurred. Check console for details.");
    }
    setIsSubmitting(false);
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const response = editingUpdate
        ? await api.updateUpdate(editingUpdate.id, {
            title: updateForm.title,
            content: updateForm.content,
            updateType: updateForm.updateType,
          })
        : await api.createUpdate({
            title: updateForm.title,
            content: updateForm.content,
            updateType: updateForm.updateType,
            companyId: updateForm.isGlobal ? undefined : updateForm.companyId,
            isGlobal: updateForm.isGlobal,
          });

      if (response.success) {
        setShowUpdateModal(false);
        setEditingUpdate(null);
        setUpdateForm({
          title: "",
          content: "",
          updateType: "general",
          companyId: "",
          isGlobal: true,
        });
        loadData();
      } else {
        setFormError(response.message || "Failed to save update");
      }
    } catch {
      setFormError("An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    const response = await api.deleteUpdate(updateId);
    if (response.success) {
      loadData();
    }
  };

  const openEditUpdate = (update: Update) => {
    setEditingUpdate(update);
    setUpdateForm({
      title: update.title,
      content: update.content,
      updateType: update.update_type as typeof updateForm.updateType,
      companyId: update.company_id || "",
      isGlobal: update.is_global,
    });
    setShowUpdateModal(true);
  };

  const handleStatusChange = async (companyId: string, newStatus: "active" | "paused" | "archived") => {
    const response = await api.updateCompanyStatus(companyId, newStatus);
    if (response.success) {
      loadData();
    }
  };

  const handleToggleClient = async (clientId: string, isActive: boolean) => {
    const response = await api.toggleClientStatus(clientId, !isActive);
    if (response.success) {
      loadData();
    }
  };

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This will permanently delete all associated data including client accounts, documents, updates, and activity logs. This action cannot be undone.`)) {
      return;
    }

    const response = await api.deleteCompany(companyId);
    if (response.success) {
      loadData();
    } else {
      alert(response.message || "Failed to delete company");
    }
  };

  const handleResendInvite = async (companyId: string, email: string) => {
    const newEmail = prompt("Enter email address for the invite:", email);
    if (!newEmail) return;

    const response = await api.resendInvite(companyId, newEmail);
    if (response.success) {
      alert(response.data?.emailSent ? "Invite sent successfully!" : "Invite created (check console for invite URL)");
      loadData();
    } else {
      alert(response.message || "Failed to resend invite");
    }
  };

  const toggleExpanded = (companyId: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  };

  const getClientsForCompany = (companyId: string) => {
    return clients.filter(c => c.company_id === companyId);
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

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "report":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "contract":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "deliverable":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "invoice":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getActivityIconStyle = (action: string) => {
    if (action.includes("login") || action.includes("logout")) {
      return "bg-blue-500/10 text-blue-400";
    }
    if (action.includes("document")) {
      return "bg-green-500/10 text-green-400";
    }
    if (action.includes("update")) {
      return "bg-purple-500/10 text-purple-400";
    }
    if (action.includes("company")) {
      return "bg-yellow-500/10 text-yellow-400";
    }
    if (action.includes("client") || action.includes("invite")) {
      return "bg-indigo-500/10 text-indigo-400";
    }
    return "bg-gray-500/10 text-gray-400";
  };

  const getActivityIcon = (action: string) => {
    if (action.includes("login")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      );
    }
    if (action.includes("logout")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
    }
    if (action.includes("document")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (action.includes("update")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    }
    if (action.includes("company")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    if (action.includes("client") || action.includes("invite")) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const formatActivityAction = (action: string) => {
    const actionLabels: Record<string, string> = {
      login: "User logged in",
      logout: "User logged out",
      password_reset_request: "Password reset requested",
      password_reset: "Password was reset",
      company_create: "Company created",
      company_update: "Company updated",
      company_status_change: "Company status changed",
      client_account_create: "Client account created",
      client_account_update: "Client account updated",
      client_account_disable: "Client account disabled",
      client_invite_send: "Client invitation sent",
      client_invite_accept: "Client accepted invitation",
      document_upload: "Document uploaded",
      document_update: "Document updated",
      document_delete: "Document deleted",
      document_download: "Document downloaded",
      update_create: "Update posted",
      update_edit: "Update edited",
      update_delete: "Update deleted",
      admin_create: "Admin user created",
      admin_update: "Admin user updated",
    };
    return actionLabels[action] || action.replace(/_/g, " ");
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedFile) {
      setFormError("Please select a file to upload");
      return;
    }

    if (!documentForm.companyId) {
      setFormError("Please select a company");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", documentForm.title);
      formData.append("description", documentForm.description);
      formData.append("category", documentForm.category);
      formData.append("companyId", documentForm.companyId);

      const response = await api.uploadDocument(formData);

      if (response.success) {
        setShowDocumentModal(false);
        setDocumentForm({
          title: "",
          description: "",
          category: "other",
          companyId: "",
        });
        setSelectedFile(null);
        loadData();
      } else {
        setFormError(response.message || "Failed to upload document");
      }
    } catch {
      setFormError("An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const response = await api.deleteDocument(documentId);
    if (response.success) {
      loadData();
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link href="/">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(["clients", "updates", "documents", "activity", "security"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-[#6366F1] text-white"
                  : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
              }`}
            >
              {tab === "activity" ? "Activity Feed" : tab === "security" ? "Security & Logs" : tab}
            </button>
          ))}
        </div>

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Companies & Clients</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Client
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : companies.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">No clients yet. Add your first client to get started.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors"
                >
                  Add Client
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {companies.map((company) => {
                  const companyClients = getClientsForCompany(company.id);
                  const isExpanded = expandedCompanies.has(company.id);

                  return (
                    <div key={company.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--background)]/50 transition-colors"
                        onClick={() => toggleExpanded(company.id)}
                      >
                        <div className="flex items-center gap-4">
                          <button className="text-[var(--text-secondary)]">
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div>
                            <Link
                              href={`/admin/company/${company.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-[var(--text-primary)] hover:text-[#6366F1] transition-colors"
                            >
                              {company.name}
                            </Link>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {company.owner_name || company.owner_email || "No owner info"}
                              {companyClients.length > 0 && (
                                <span className="ml-2 text-[var(--text-secondary)]">
                                  • {companyClients.length} client{companyClients.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Resend Invite button - only show if no client account but has pending invite */}
                          {!company.account_email && company.pending_invite_email && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResendInvite(company.id, company.pending_invite_email || company.owner_email || "");
                              }}
                              className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                              title="Resend Invite"
                            >
                              Resend Invite
                            </button>
                          )}
                          {/* Send Invite button - only show if no client account and no pending invite */}
                          {!company.account_email && !company.pending_invite_email && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResendInvite(company.id, company.owner_email || "");
                              }}
                              className="px-2 py-1 text-xs bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition-colors"
                              title="Send Invite"
                            >
                              Send Invite
                            </button>
                          )}
                          <select
                            value={company.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(company.id, e.target.value as "active" | "paused" | "archived")}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
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
                          <Link
                            href={`/admin/company/${company.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-[var(--text-secondary)] hover:text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCompany(company.id, company.name);
                            }}
                            className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Company"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[var(--border)] bg-[var(--background)]/30">
                          {companyClients.length === 0 ? (
                            <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
                              No client accounts for this company
                            </div>
                          ) : (
                            <div className="divide-y divide-[var(--border)]">
                              {companyClients.map((client) => (
                                <div key={client.id} className="flex items-center justify-between p-4 pl-12">
                                  <div>
                                    <p className="font-medium text-[var(--text-primary)]">{client.name}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{client.email}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-xs text-[var(--text-secondary)]">
                                      {client.last_login_at
                                        ? `Last login: ${new Date(client.last_login_at).toLocaleDateString()}`
                                        : "Never logged in"}
                                    </span>
                                    <button
                                      onClick={() => handleToggleClient(client.id, client.is_active)}
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        client.is_active
                                          ? "bg-green-500/10 text-green-400"
                                          : "bg-red-500/10 text-red-400"
                                      }`}
                                    >
                                      {client.is_active ? "Active" : "Disabled"}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === "updates" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Updates & Announcements</h2>
              <button
                onClick={() => {
                  setEditingUpdate(null);
                  setUpdateForm({
                    title: "",
                    content: "",
                    updateType: "general",
                    companyId: "",
                    isGlobal: true,
                  });
                  setShowUpdateModal(true);
                }}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post Update
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : updates.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">No updates yet. Post your first update to clients.</p>
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors"
                >
                  Post Update
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{update.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getUpdateTypeStyle(update.update_type)}`}>
                            {update.update_type}
                          </span>
                        </div>
                        <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{update.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditUpdate(update)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-4">
                        <span>Posted by {update.created_by_name}</span>
                        {update.is_global ? (
                          <span className="px-2 py-0.5 rounded bg-[var(--background)] text-xs">All clients</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-[var(--background)] text-xs">{update.company_name}</span>
                        )}
                      </div>
                      <span>{new Date(update.published_at).toLocaleDateString()}</span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Documents</h2>
              <button
                onClick={() => {
                  setDocumentForm({
                    title: "",
                    description: "",
                    category: "other",
                    companyId: "",
                  });
                  setSelectedFile(null);
                  setShowDocumentModal(true);
                }}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">No documents yet. Upload your first document to share with clients.</p>
                <button
                  onClick={() => setShowDocumentModal(true)}
                  className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5558E3] transition-colors"
                >
                  Upload Document
                </button>
              </div>
            ) : (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Document</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Company</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Category</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Size</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Uploaded</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[var(--background)]/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">{doc.title}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{doc.file_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[var(--text-primary)]">{doc.company_name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryStyle(doc.category)}`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                          {formatFileSize(doc.file_size)}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-[var(--text-primary)]">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                            <p className="text-xs text-[var(--text-secondary)]">by {doc.uploaded_by_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-[var(--text-secondary)] mr-2">
                              {doc.download_count} download{doc.download_count !== 1 ? "s" : ""}
                            </span>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === "activity" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Activity Feed</h2>
              <div className="flex items-center gap-3">
                <select
                  value={activityFilter.companyId}
                  onChange={(e) => {
                    setActivityFilter({ ...activityFilter, companyId: e.target.value });
                  }}
                  className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={activityFilter.eventType}
                  onChange={(e) => {
                    setActivityFilter({ ...activityFilter, eventType: e.target.value });
                  }}
                  className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="">All Events</option>
                  <option value="login">Logins</option>
                  <option value="documents">Documents</option>
                  <option value="updates">Updates</option>
                  <option value="access">Access Changes</option>
                  <option value="company">Company Changes</option>
                </select>
                <button
                  onClick={() => loadData()}
                  className="px-4 py-2 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
              </div>
            ) : activities.length === 0 ? (
              <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--border)] text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)]">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="divide-y divide-[var(--border)]">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-[var(--background)]/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityIconStyle(activity.action)}`}>
                            {getActivityIcon(activity.action)}
                          </div>
                          <div>
                            <p className="text-[var(--text-primary)] font-medium">
                              {formatActivityAction(activity.action)}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {activity.user_name || activity.user_email || "Unknown user"}
                              {activity.user_type === "admin" && (
                                <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-[#6366F1]/10 text-[#6366F1]">Admin</span>
                              )}
                              {activity.company_name && (
                                <span className="ml-2">• {activity.company_name}</span>
                              )}
                            </p>
                            {activity.ip_address && (
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                IP: {activity.ip_address}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--text-secondary)]">
                            {formatActivityTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Logs Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Security & Logs</h2>
              <button
                onClick={() => loadData()}
                className="px-4 py-2 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Suspicious Activity Alerts */}
            {securityData.multipleIpUsers.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-400 mb-1">Potential Suspicious Activity</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      The following accounts have logged in from multiple IP addresses in the last 30 days:
                    </p>
                    <div className="space-y-2">
                      {securityData.multipleIpUsers.map((user, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${user.user_type === "admin" ? "bg-[#6366F1]/10 text-[#6366F1]" : "bg-gray-500/10 text-gray-400"}`}>
                            {user.user_type}
                          </span>
                          <span className="text-[var(--text-primary)]">{user.unique_ips} unique IPs</span>
                          <span className="text-[var(--text-secondary)]">({user.ip_addresses.slice(0, 3).join(", ")}{user.ip_addresses.length > 3 ? "..." : ""})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login History */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Login History</h3>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
                </div>
              ) : securityData.loginHistory.length === 0 ? (
                <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)] text-center">
                  <p className="text-[var(--text-secondary)]">No login history available.</p>
                </div>
              ) : (
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">User</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Type</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Action</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">IP Address</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {securityData.loginHistory.map((log) => (
                        <tr key={log.id} className="hover:bg-[var(--background)]/50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">{log.user_name || "Unknown"}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{log.user_email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${log.user_type === "admin" ? "bg-[#6366F1]/10 text-[#6366F1]" : "bg-gray-500/10 text-gray-400"}`}>
                              {log.user_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              log.action === "login" ? "bg-green-500/10 text-green-400" :
                              log.action === "logout" ? "bg-gray-500/10 text-gray-400" :
                              "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {formatActivityAction(log.action)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] text-sm font-mono">
                            {log.ip_address || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Company + Client Modal */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-lg border border-[var(--border)] max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Add New Client</h3>

              {formError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCompanyAndClient} className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                        placeholder="Acme Corporation"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Owner Name</label>
                        <input
                          type="text"
                          value={form.ownerName}
                          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                          className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-1">Owner Email</label>
                        <input
                          type="email"
                          value={form.ownerEmail}
                          onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                          placeholder="john@acme.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border)]" />

                <div>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Client Portal Account
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Contact Name *</label>
                      <input
                        type="text"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--text-secondary)] mb-1">Login Email *</label>
                      <input
                        type="email"
                        value={form.clientEmail}
                        onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                        placeholder="jane@acme.com"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sendInvite"
                        checked={form.sendInvite}
                        onChange={(e) => setForm({ ...form, sendInvite: e.target.checked })}
                        className="rounded border-[var(--border)]"
                      />
                      <label htmlFor="sendInvite" className="text-sm text-[var(--text-secondary)]">
                        Send invite email to set up password
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Client"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Create/Edit Update Modal */}
      {showUpdateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowUpdateModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-lg border border-[var(--border)] max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                {editingUpdate ? "Edit Update" : "Post New Update"}
              </h3>

              {formError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Title *</label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                    placeholder="Update title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Content *</label>
                  <textarea
                    value={updateForm.content}
                    onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1] min-h-[120px] resize-y"
                    placeholder="Write your update here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Type</label>
                  <select
                    value={updateForm.updateType}
                    onChange={(e) => setUpdateForm({ ...updateForm, updateType: e.target.value as typeof updateForm.updateType })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="general">General</option>
                    <option value="status">Status Update</option>
                    <option value="deliverable">Deliverable</option>
                    <option value="announcement">Announcement</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {!editingUpdate && (
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Target Audience</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={updateForm.isGlobal}
                          onChange={() => setUpdateForm({ ...updateForm, isGlobal: true, companyId: "" })}
                          className="text-[#6366F1]"
                        />
                        <span className="text-[var(--text-primary)]">All clients</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={!updateForm.isGlobal}
                          onChange={() => setUpdateForm({ ...updateForm, isGlobal: false })}
                          className="text-[#6366F1]"
                        />
                        <span className="text-[var(--text-primary)]">Specific company</span>
                      </label>
                    </div>

                    {!updateForm.isGlobal && (
                      <select
                        value={updateForm.companyId}
                        onChange={(e) => setUpdateForm({ ...updateForm, companyId: e.target.value })}
                        className="w-full mt-2 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                        required
                      >
                        <option value="">Select a company</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setEditingUpdate(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : editingUpdate ? (
                      "Save Changes"
                    ) : (
                      "Post Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Upload Document Modal */}
      {showDocumentModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDocumentModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-lg border border-[var(--border)] max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Upload Document</h3>

              {formError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Company *</label>
                  <select
                    value={documentForm.companyId}
                    onChange={(e) => setDocumentForm({ ...documentForm, companyId: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Title *</label>
                  <input
                    type="text"
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                    placeholder="Document title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Description</label>
                  <textarea
                    value={documentForm.description}
                    onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1] min-h-[80px] resize-y"
                    placeholder="Optional description..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-1">Category</label>
                  <select
                    value={documentForm.category}
                    onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value as typeof documentForm.category })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="other">Other</option>
                    <option value="report">Report</option>
                    <option value="contract">Contract</option>
                    <option value="deliverable">Deliverable</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">File *</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      selectedFile
                        ? "border-[#6366F1] bg-[#6366F1]/5"
                        : "border-[var(--border)] hover:border-[#6366F1]/50"
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[var(--text-primary)] font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="ml-2 p-1 text-[var(--text-secondary)] hover:text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <svg className="w-10 h-10 mx-auto text-[var(--text-secondary)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <p className="text-[var(--text-primary)] font-medium">Click to upload</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">PDF, DOC, XLS, PPT, images up to 50MB</p>
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.csv,.zip"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedFile(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Upload Document"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
