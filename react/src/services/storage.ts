
export interface Storage {
  getItem(key: string): string|null,
  setItem(key: string, value: string): void,
  removeItem(key: string): void,
  clear(): void,
}

export class LocalStorage implements Storage{
  getItem(key: string): string|null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  clear(): void {
    localStorage.clear()
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
