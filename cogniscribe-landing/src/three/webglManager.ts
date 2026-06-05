// Global manager — only one WebGL context active at a time
type Listener = (id: string | null) => void;

class WebGLManager {
  private activeId: string | null = null;
  private listeners: Listener[] = [];

  request(id: string): boolean {
    if (this.activeId === id) return true;
    if (this.activeId !== null) {
      this.activeId = null;
      this.notify();
    }
    this.activeId = id;
    this.notify();
    return true;
  }

  release(id: string) {
    if (this.activeId === id) {
      this.activeId = null;
      this.notify();
    }
  }

  isActive(id: string): boolean {
    return this.activeId === id;
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.activeId));
  }
}

export const webglManager = new WebGLManager();