import { useState, useEffect } from "react";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const useAuth = () => {
  const [authState, setAuthState] = useState(getCookie("authToken"));

  useEffect(() => {
    const checkAuth = () => {
      setAuthState(getCookie("authToken")); // Update state when cookie changes
    };

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return !!authState;
};

export default useAuth;
