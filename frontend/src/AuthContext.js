import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        // Check if token is expired (you should implement proper JWT expiration checking)
        // For now, we'll just check if token exists
        if (token) {
          // You could decode the JWT here to check expiration
          // const decoded = jwt_decode(token);
          // if (decoded.exp * 1000 < Date.now()) {
          //   // Token expired, try to refresh
          //   // handleTokenRefresh(refreshToken);
          // }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
