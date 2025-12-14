import { useCallback, useRef, useState } from 'react';

export const useDebounce = (value: string, onChange?: (value: string) => void, delay = 500) => {
  const [currentValue, setCurrentValue] = useState(value);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCurrentValue(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange?.(value);
      }, delay);
    },
    [onChange, delay]
  );

  return { value: currentValue, onChange: handleChange };
};
