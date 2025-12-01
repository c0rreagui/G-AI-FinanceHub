import { useMemo } from 'react';

export const useSmartDefaults = () => {
  const defaults = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Suggest category based on time of day (simple heuristic)
    let suggestedCategory = 'Outros';
    if (hour >= 6 && hour < 11) suggestedCategory = 'Alimentação'; // Breakfast
    else if (hour >= 11 && hour < 14) suggestedCategory = 'Alimentação'; // Lunch
    else if (hour >= 18 && hour < 22) suggestedCategory = 'Lazer'; // Dinner/Fun
    
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      category: suggestedCategory,
      currency: 'BRL',
    };
  }, []);

  return defaults;
};
