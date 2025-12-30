import { useCallback } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export const useShare = () => {
  const share = useCallback(async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback: Copy to clipboard
      if (data.url) {
        navigator.clipboard.writeText(data.url);
        // You might want to trigger a toast here
        return 'copied';
      }
      return false;
    }
  }, []);

  return { share };
};
