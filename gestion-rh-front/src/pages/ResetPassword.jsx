import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import './ResetPassword.css';
import { FaLock, FaCheckCircle, FaExclamationTriangle, FaKey } from 'react-icons/fa';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Mot de passe modifié avec succès");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Lien invalide ou expiré"
      );
    }
  };

  return (
  <form onSubmit={handleSubmit} className="reset-password-form">
    <h2>Réinitialiser le mot de passe</h2>

    <div className="input-with-icon">
      <FaLock className="input-icon" />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <div className="input-with-icon">
      <FaLock className="input-icon" />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
      />
    </div>

    {error && (
      <div className="message error-message">
        <FaExclamationTriangle className="message-icon" />
        {error}
      </div>
    )}
    
    {success && (
      <div className="message success-message">
        <FaCheckCircle className="message-icon" />
        {success}
      </div>
    )}

    <button type="submit">
      <FaKey className="button-icon" />
      Changer le mot de passe
    </button>
  </form>
);
}
