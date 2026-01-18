const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
        }
        return { success: false, message: data.message || 'Request failed' };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  }

  // Auth endpoints
  async adminLogin(email: string, password: string) {
    const response = await this.request<{ token: string; admin: unknown }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async clientLogin(email: string, password: string) {
    const response = await this.request<{ token: string; client: unknown }>('/auth/client/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getMe() {
    return this.request<{ user: unknown; type: 'admin' | 'client' }>('/auth/me');
  }

  async logout() {
    this.setToken(null);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Admin - Companies
  async getCompanies(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ companies: unknown[]; pagination: unknown }>(`/admin/companies?${query}`);
  }

  async getCompany(id: string) {
    return this.request<{ company: unknown }>(`/admin/companies/${id}`);
  }

  async createCompany(data: {
    name: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    notes?: string;
  }) {
    return this.request<{ company: unknown }>('/admin/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompany(id: string, data: Partial<{
    name: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    notes: string;
  }>) {
    return this.request<{ company: unknown }>(`/admin/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateCompanyStatus(id: string, status: 'active' | 'paused' | 'archived') {
    return this.request<{ company: unknown }>(`/admin/companies/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteCompany(id: string) {
    return this.request(`/admin/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Clients
  async getClients(params?: { companyId?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ clients: unknown[]; pagination: unknown }>(`/admin/clients?${query}`);
  }

  async createClient(data: {
    companyId: string;
    email: string;
    name: string;
    sendInvite?: boolean;
  }) {
    return this.request<{ client: unknown; invite?: unknown }>('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendInvite(companyId: string, email: string) {
    return this.request<{ invite: unknown; inviteUrl: string; emailSent: boolean }>(`/admin/clients/resend-invite/${companyId}`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async toggleClientStatus(clientId: string, isActive: boolean) {
    return this.request<{ client: unknown }>(`/admin/clients/${clientId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  async resetClientPassword(clientId: string) {
    return this.request<{ resetToken: string }>(`/admin/clients/${clientId}/reset-password`, {
      method: 'POST',
    });
  }

  // Admin - Updates
  async getUpdates(params?: { companyId?: string; type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<unknown[]>(`/admin/updates?${query}`);
  }

  async createUpdate(data: {
    title: string;
    content: string;
    companyId?: string;
    isGlobal?: boolean;
    updateType?: 'general' | 'status' | 'deliverable' | 'announcement' | 'urgent';
  }) {
    return this.request<{ update: unknown }>('/admin/updates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUpdate(id: string, data: Partial<{
    title: string;
    content: string;
    updateType: string;
  }>) {
    return this.request<{ update: unknown }>(`/admin/updates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUpdate(id: string) {
    return this.request(`/admin/updates/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Documents
  async getDocuments(params?: { companyId?: string; category?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<unknown[]>(`/admin/documents?${query}`);
  }

  async uploadDocument(formData: FormData) {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/admin/documents`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  async deleteDocument(id: string) {
    return this.request(`/admin/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Activity Feed
  async getActivityFeed(params?: { companyId?: string; eventType?: string; dateFrom?: string; dateTo?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ activities: unknown[]; pagination: unknown }>(`/admin/activity?${query}`);
  }

  async getActivityStats(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<{
      totalEvents: number;
      logins: number;
      documentActions: number;
      updateActions: number;
      suspiciousActivity: number;
      period: string;
    }>(`/admin/activity/stats${query}`);
  }

  async getSecurityActivity(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{
      loginHistory: unknown[];
      multipleIpUsers: unknown[];
    }>(`/admin/activity/security?${query}`);
  }

  // Client endpoints
  async getClientDashboard() {
    return this.request<{
      company: unknown;
      recentUpdates: unknown[];
      recentDocuments: unknown[];
      unreadNotifications: number;
    }>('/client/dashboard');
  }

  async getClientUpdates(params?: { type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ updates: unknown[]; pagination: unknown }>(`/client/updates?${query}`);
  }

  async getClientDocuments(params?: { category?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ documents: unknown[]; pagination: unknown }>(`/client/documents?${query}`);
  }

  async downloadDocument(id: string) {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/client/documents/${id}/download`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async getClientNotifications(params?: { unreadOnly?: boolean; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ notifications: unknown[]; pagination: unknown }>(`/client/notifications?${query}`);
  }

  async markNotificationRead(id: string) {
    return this.request(`/client/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/client/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Invite acceptance
  async validateInvite(token: string) {
    return this.request<{ valid: boolean; email: string; companyName: string }>(`/invite/validate/${token}`);
  }

  async acceptInvite(token: string, password: string) {
    return this.request<{ client: unknown }>('/invite/accept', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }
}

export const api = new ApiClient();
export default api;
