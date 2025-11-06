import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginView from "@/components/LoginView";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si déjà connecté, rediriger vers le dashboard
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = async () => {
    navigate("/dashboard", { replace: true });
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
};

export default Login;

