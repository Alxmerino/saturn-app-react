const prefix = 'saturn_tt:';

const LocalStore = {
  get(key: string): any {
    return JSON.parse(localStorage.getItem(prefix + key) ?? 'null');
  },
  set(key: string, value: any): void {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(prefix + key);
  },
};

export default LocalStore;
