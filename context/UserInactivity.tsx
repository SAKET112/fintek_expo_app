import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { MMKV } from 'react-native-mmkv';



class MMKVFaker {
    private data: { [key: string]: any } = {};  // Changed to store any type of data
  
    getString(key: string): string | undefined {
      return this.data[key];
    }
  
    set(key: string, value: string) {
      this.data[key] = value;
    }
  
    delete(key: string) {
      if (this.data[key]) this.data[key] = undefined;
    }
  
    clearAll() {
      this.data = {};
    }

    getNumber(key: string): number | undefined {
      const value = this.data[key];
      if (typeof value === 'number') {
        return value;
      }
      return undefined;
    }

    setNumber(key: string, value: number) {
      this.data[key] = value;
    }
}

const storage = __DEV__ ? new MMKVFaker() : new MMKV({
    id: 'inactivity-storage',
});


export const UserInactivityProvider = ({children}: any) => {
    const appState = useRef(AppState.currentState);
    const router = useRouter();
    const {isSignedIn} = useAuth();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    
        return () => {
          subscription.remove();
        };
      }, []);
    
      const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        console.log('🚀 ~ handleAppStateChange ~ nextAppState', nextAppState);
    
        if (nextAppState === 'background') {
          recordStartTime();
        } else if (nextAppState === 'active' && appState.current.match(/background/)) {
          const elapsed = Date.now() - (storage.getNumber('startTime') || 0);
          console.log('🚀 ~ handleAppStateChange ~ elapsed:', elapsed);
    
          if (elapsed > 3000 && isSignedIn) {
            router.replace('/(authenticated)/(modals)/lock');
          }
        }
        appState.current = nextAppState;
      };
    
      const recordStartTime = () => {
        storage.set('startTime', Date.now());
      };

    return children;
}