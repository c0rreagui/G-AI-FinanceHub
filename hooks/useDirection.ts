import { useEffect, useState } from 'react';

type Direction = 'ltr' | 'rtl';

export const useDirection = () => {
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
  };

  return { direction, setDirection, toggleDirection };
};
