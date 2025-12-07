import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function generateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-device';
  let id = localStorage.getItem('magic_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('magic_device_id', id);
  }
  return id;
}

export function generateDeviceName(): string {
  if (typeof window === 'undefined') return 'Unknown Device';

  let name = localStorage.getItem('magic_device_name');
  if (name) return name;

  const ua = window.navigator.userAgent;
  let deviceType = "Device";
  if (ua.includes("Mac")) deviceType = "MacBook";
  else if (ua.includes("Win")) deviceType = "Windows PC";
  else if (ua.includes("Linux")) deviceType = "Linux";
  else if (ua.includes("iPhone")) deviceType = "iPhone";
  else if (ua.includes("Android")) deviceType = "Android";

  // Add random number to make it unique-ish
  const randomSuffix = Math.floor(Math.random() * 1000);
  name = `${deviceType} ${randomSuffix}`;
  localStorage.setItem('magic_device_name', name);
  return name;
}
