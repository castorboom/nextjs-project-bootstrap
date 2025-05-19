import os from 'os';
import { machineIdSync } from 'node-machine-id';
import { exec } from 'child_process';

export interface SystemData {
  hostname: string;
  macAddresses: string[];
  osVersion: string;
  uptime: number;
  networkDisconnects: number;
  localIPs: string[];
  publicIP?: string;
  hardwareId: string;
}

export class SystemDataService {
  private networkDisconnectsCount = 0;

  getHostname(): string {
    return os.hostname();
  }

  getMacAddresses(): string[] {
    const interfaces = os.networkInterfaces();
    const macs: string[] = [];
    for (const name in interfaces) {
      const iface = interfaces[name];
      if (iface) {
        iface.forEach((info) => {
          if (!info.internal && info.mac && info.mac !== '00:00:00:00:00:00') {
            macs.push(info.mac);
          }
        });
      }
    }
    return macs;
  }

  getOSVersion(): string {
    return `${os.type()} ${os.release()}`;
  }

  getUptime(): number {
    return os.uptime();
  }

  getLocalIPs(): string[] {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name in interfaces) {
      const iface = interfaces[name];
      if (iface) {
        iface.forEach((info) => {
          if (!info.internal && info.family === 'IPv4') {
            ips.push(info.address);
          }
        });
      }
    }
    return ips;
  }

  async getPublicIP(): Promise<string | undefined> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return undefined;
    }
  }

  getHardwareId(): string {
    // Use machineIdSync for persistent unique hardware ID
    return machineIdSync();
  }

  getNetworkDisconnects(): number {
    return this.networkDisconnectsCount;
  }

  incrementNetworkDisconnects() {
    this.networkDisconnectsCount++;
  }

  getDiskUsage(): Promise<{ total: number; free: number }> {
    return new Promise((resolve, reject) => {
      exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        const lines = stdout.trim().split('\n');
        let total = 0;
        let free = 0;
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          if (parts.length === 3 && parts[0] !== 'Caption') {
            free += parseInt(parts[1], 10);
            total += parseInt(parts[2], 10);
          }
        });
        resolve({ total, free });
      });
    });
  }

  getCriticalErrors(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      exec(
        'wevtutil qe System /q:"*[System[(Level=1 or Level=2)]]" /f:text /c:10',
        (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const errors = stdout.trim().split('\n\n');
          resolve(errors);
        }
      );
    });
  }
}
