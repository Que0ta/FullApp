import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export function useVerifyUser(redirectTo = "/dashboard") {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          navigate(redirectTo); // already logged in → redirect
        }
      } catch (err) {
        // user not logged in → ignore
      }
    };

    checkAuth();
  }, [navigate, setUser, redirectTo]);
}
