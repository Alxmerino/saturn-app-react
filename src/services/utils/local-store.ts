const prefix = 'saturn_tt:';

const LocalStore = {
  get(key: string, encode = false): any {
    const _key = encode ? btoa(key) : key;
    const value = localStorage.getItem(prefix + _key) ?? 'null';

    return JSON.parse(encode && value !== 'null' ? atob(value) : value);
  },
  set(key: string, value: any, encode = false): void {
    const itemKey = encode ? btoa(key) : key;
    const itemValue = encode
      ? btoa(JSON.stringify(value))
      : JSON.stringify(value);
    localStorage.setItem(prefix + itemKey, itemValue);
  },
  remove(key: string): void {
    localStorage.removeItem(prefix + key);
  },
};

export default LocalStore;
