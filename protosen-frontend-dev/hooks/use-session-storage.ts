"use client"
import { useState } from "react";

export function useSessionStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T | undefined) => T)) => {
    try {
      if (typeof window !== 'undefined') {
        const valueToStore = value instanceof Function 
          ? value(storedValue) 
          : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
        setStoredValue(undefined);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}