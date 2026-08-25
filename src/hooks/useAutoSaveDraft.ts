import { useState, useEffect, useRef } from 'react';

export function useAutoSaveDraft<T>(
  key: string,
  initialValue: T,
  onSave: (data: T) => void,
  delay: number = 500
) {
  const [data, setData] = useState<T>(() => {
    try {
      const draft = localStorage.getItem(key);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (err) {
      // Fallback if JSON parse fails
    }
    return initialValue;
  });

  const prevKey = useRef(key);
  useEffect(() => {
    if (prevKey.current !== key) {
      prevKey.current = key;
      try {
        const draft = localStorage.getItem(key);
        if (draft) {
          setData(JSON.parse(draft));
          return;
        }
      } catch (err) {
        // Fallback if JSON parse fails
      }
      setData(initialValue);
    }
  }, [key, initialValue]);

  const timerRef = useRef<NodeJS.Timeout>();
  const isFirstRender = useRef(true);

  // We use a ref for onSave so it doesn't trigger effect on every render if it's not memoized
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem(key, JSON.stringify(data));
    clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      onSaveRef.current(data);
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [data, key, delay]);

  const clearDraft = () => {
    localStorage.removeItem(key);
  };

  return { data, setData, clearDraft };
}
