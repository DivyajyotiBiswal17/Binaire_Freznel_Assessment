export type ConnectionStatus = "online" | "offline";
type Listener = (s: ConnectionStatus) => void;

export class ConnectivityMonitor {
  private status: ConnectionStatus = navigator.onLine ? "online" : "offline";
  private listeners = new Set<Listener>();
  private timer?: number;

  constructor(private heartbeatUrl = "/heartbeat.txt", private intervalMs = 8000) {}

  start(): void {
    window.addEventListener("online", this.check);
    window.addEventListener("offline", this.check);
    this.timer = window.setInterval(this.check, this.intervalMs);
    void this.check();
  }

  stop(): void {
    window.removeEventListener("online", this.check);
    window.removeEventListener("offline", this.check);
    clearInterval(this.timer);
  }

  getStatus = (): ConnectionStatus => this.status;

  subscribe = (l: Listener): (() => void) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  private check = async (): Promise<void> => {
    let next: ConnectionStatus = "offline";
    if (navigator.onLine) {
      try {
        const res = await fetch(`${this.heartbeatUrl}?t=${Date.now()}`, { method: "HEAD", cache: "no-store" });
        next = res.ok ? "online" : "offline";
      } catch { next = "offline"; }
    }
    if (next !== this.status) {
      this.status = next;
      this.listeners.forEach((l) => l(next));
    }
  };
}

export const connectivity = new ConnectivityMonitor();