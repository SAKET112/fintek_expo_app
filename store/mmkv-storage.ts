import { StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';


class MMKVFaker {
  private data = {};

  getString(key: string) {
    return this.data[key]
  }

  set(key: string, value: string) {
    this.data[key] = value
  }

  delete(key: string) {
    if (this.data[key]) this.data[key] = undefined
  }

  clearAll() {
    this.data = {}
  }
}

// const storage = new MMKV({
//   id: 'balance-storage',
// });

const storage = __DEV__ ? new MMKVFaker() : new MMKV({
  id: 'balance-storage',
})

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};
