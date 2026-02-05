import "./Login.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [message, setMessage] = useState('');


  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data);

      const { user } = res.data;

      if (user.role === "STAGIAIRE") {
        navigate(
          user.is_profile_completed
            ? "/stagiaire/profile"
            : "/stagiaire/complete-profile",
          { replace: true }
        );
      } else {
        navigate(
          user.is_profile_completed ? "/profile" : "/complete-profile",
          { replace: true }
        );
      }
    } catch (err) {
      console.error("Login failed:", err);

      // Check for archived account
      if (err.response?.status === 403 && err.response.data?.message.includes('archivé')) {
          setError(err.response.data.message);
      } else {
          setError("Email ou mot de passe incorrect");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

      console.log("EMAIL SENT:", email);
    try {
      const res = await api.post('/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };


  return (
    <div className="login-page-container">
      <div className="login-form-container">

        {successMessage && (
          <div className="info-box">
            <span className="success-icon">✓</span>
            <p className="success">{successMessage}</p>
          </div>
        )}

        <div className="login-form-header">
          <h2>Connexion à HRDigitize</h2>
          <p>Entrez vos identifiants pour accéder à votre compte</p>
        </div>
        {!showForgot &&(
          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-input-group">
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                >
                  {showPassword ? "Cacher" : "Afficher"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              Se connecter
            </button>

            <div className="login-links">
              <p style={{ cursor: 'pointer', color: '#007bff' }} onClick={()=> setShowForgot(true)}>Mot de passe oublié ?</p>
            </div>
          </form>
        )}
        {showForgot && (
        <form onSubmit={handleForgotPassword}>
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Saisissez Votre Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="login-submit-btn">Réinitialiser le mot de passe</button>
            <div className="login-links">
              <p
                onClick={() => setShowForgot(false)}
                style={{ cursor: 'pointer', color: '#007bff' }}
              >
                &larr; Revenir à la connexion
              </p>
            </div>
          </div>
        </form>
      )}

      </div>
    </div>
  );
};

export default Login;
