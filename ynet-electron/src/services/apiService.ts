import axios from 'axios';

const API_BASE_URL = 'https://your-api-server.com/api';

export class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async login(username: string, password: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    if (response.data.code === 0) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    if (response.data.code === 0) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  private getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async registerDevice(deviceInfo: { hwid: string; hostname: string; osVersion: string }) {
    return axios.post(`${API_BASE_URL}/devices/register`, deviceInfo, {
      headers: this.getAuthHeaders(),
    });
  }

  async sendHeartbeat(deviceId: string, timestamp: string, status: string) {
    return axios.post(
      `${API_BASE_URL}/devices/${deviceId}/heartbeat`,
      { timestamp, status },
      { headers: this.getAuthHeaders() }
    );
  }

  async sendMetrics(deviceId: string, metrics: any[]) {
    return axios.post(`${API_BASE_URL}/devices/${deviceId}/metrics`, metrics, {
      headers: this.getAuthHeaders(),
    });
  }

  async getPublicIP(deviceId: string) {
    return axios.get(`${API_BASE_URL}/devices/${deviceId}/ip/public`, {
      headers: this.getAuthHeaders(),
    });
  }

  async sendCommand(deviceId: string, command: string) {
    return axios.post(
      `${API_BASE_URL}/devices/${deviceId}/commands`,
      { command },
      { headers: this.getAuthHeaders() }
    );
  }

  async getCommandStatus(deviceId: string, cmdId: string) {
    return axios.get(`${API_BASE_URL}/devices/${deviceId}/commands/${cmdId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getCriticalErrors(deviceId: string, since?: string) {
    return axios.get(`${API_BASE_URL}/devices/${deviceId}/errors`, {
      headers: this.getAuthHeaders(),
      params: { since },
    });
  }

  async logNetworkDisconnect(deviceId: string, timestamp: string, iface: string) {
    return axios.post(
      `${API_BASE_URL}/devices/${deviceId}/disconnects`,
      { timestamp, interface: iface },
      { headers: this.getAuthHeaders() }
    );
  }
}
