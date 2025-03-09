import { useCallback } from "react";

const useRemoveAuthToken = () => {
  const removeAuthToken = useCallback(() => {
    if (typeof document !== 'undefined') { // Ensure it's only run on the client
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      window.dispatchEvent(new Event("authChange")); // Notify components
    }
  }, []);

  return removeAuthToken;
};

export default useRemoveAuthToken;
