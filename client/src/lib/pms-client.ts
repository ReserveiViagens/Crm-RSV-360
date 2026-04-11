// PMS API Client for RSV360 Backend
// Connects to PMS backend via CRM backend proxy (/api/pms/*)

const PMS_BASE_URL = '/api/pms';

export interface PMSResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class PMSClient {
  private baseURL: string;

  constructor(baseURL: string = PMS_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PMSResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/api/v1/auth/profile');
  }

  // Users endpoints
  async getUsers() {
    return this.request('/api/v1/users');
  }

  async getUser(id: string) {
    return this.request(`/api/v1/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Excursions endpoints
  async getExcursions() {
    return this.request('/api/v1/excursions');
  }

  async getExcursion(id: string) {
    return this.request(`/api/v1/excursions/${id}`);
  }

  async createExcursion(excursionData: any) {
    return this.request('/api/v1/excursions', {
      method: 'POST',
      body: JSON.stringify(excursionData),
    });
  }

  async updateExcursion(id: string, excursionData: any) {
    return this.request(`/api/v1/excursions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(excursionData),
    });
  }

  // Reservations endpoints
  async getReservations() {
    return this.request('/api/v1/reservations');
  }

  async getReservation(id: string) {
    return this.request(`/api/v1/reservations/${id}`);
  }

  async createReservation(reservationData: any) {
    return this.request('/api/v1/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async updateReservation(id: string, reservationData: any) {
    return this.request(`/api/v1/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    });
  }

  // Other domains - add as needed
  async getEnterprises() {
    return this.request('/api/v1/enterprises');
  }

  async getProperties() {
    return this.request('/api/v1/properties');
  }

  async getAccommodations() {
    return this.request('/api/v1/accommodations');
  }

  async getParks() {
    return this.request('/api/v1/parks');
  }

  async getAttractions() {
    return this.request('/api/v1/attractions');
  }

  async getPromotions() {
    return this.request('/api/v1/promotions');
  }

  async getTravel() {
    return this.request('/api/v1/travel');
  }

  async getRecommendations() {
    return this.request('/api/v1/recommendations');
  }

  async search(query: any) {
    return this.request('/api/v1/search', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async getLeads() {
    return this.request('/api/v1/leads');
  }

  async getProducts() {
    return this.request('/api/v1/products');
  }
}

export const pmsClient = new PMSClient();
export default pmsClient;