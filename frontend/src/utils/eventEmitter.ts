// eventEmitter.ts
type EventCallback = (data?: any) => void;

class EventEmitter {
  private map: Map<string, Set<EventCallback>>;

  constructor() {
    this.map = new Map();
  }

  on(event: string, callback: EventCallback) {
    if (!this.map.has(event)) {
      this.map.set(event, new Set());
    }
    this.map.get(event)?.add(callback);
  }

  off(event: string, callback: EventCallback) {
    this.map.get(event)?.delete(callback);
  }

  emit(event: string, data?: any) {
    this.map.get(event)?.forEach(callback => callback(data));
  }
}

export const eventEmitter = new EventEmitter();