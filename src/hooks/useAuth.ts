import { useState, useEffect } from "react";

// Specify the state type for `authState` to only accept `string | null`.
const useAuth = () => {
  const [authState, setAuthState] = useState<string | null>(null); // Initialize as null

  useEffect(() => {
    if (typeof document !== 'undefined') { // Only run this code on the client
      const authToken = getCookie("authToken");
      setAuthState(authToken); // `authToken` is either `string | null`
    }

    const checkAuth = () => {
      if (typeof document !== 'undefined') {
        setAuthState(getCookie("authToken")); // Update state when cookie changes
      }
    };

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return !!authState; // This will return true if `authState` is not null
};

export default useAuth;

const getCookie = (name: string): string | null => { // Ensure `getCookie` returns `string | null`
  if (typeof document !== 'undefined') { // Ensure it's only run on the client side
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  }
  return null;
};
