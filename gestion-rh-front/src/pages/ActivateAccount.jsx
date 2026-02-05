import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ActivateAccount.css";
import { FaPaperPlane, FaRedoAlt, FaRegClock } from 'react-icons/fa';

export default function ActivateAccount() {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    passwordConfirmation: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/activate-account", {
        email: formData.email,
        registration_code: formData.code,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });

      console.log("Activation response:", response.data);
      setSuccess("Compte activé avec succès !");

      // Redirect to login with success message
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message: "Compte activé avec succès. Veuillez vous connecter pour compléter votre profil.",
          },
        });
      }, 2000);

    } catch (err) {
      console.error("Activation failed:", err.response?.data);
      setError(err.response?.data?.message || "L'activation a échoué. Veuillez vérifier vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
  if (!formData.email) {
    setError("Veuillez saisir votre email pour renvoyer le code");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await api.post("/resend-activation-code", { email: formData.email });
    setSuccess(res.data.message); // "Nouveau code d’activation envoyé avec succès"
  } catch (err) {
    setError(err.response?.data?.message || "Impossible de renvoyer le code");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="activate-page-container">
      <div className="activate-form-container">
        {/* Header */}
        <div className="activate-form-header">
          <div className="activate-info-icon">✓</div>
          <h2>Activez Votre Compte</h2>
          <p>Entrez les informations reçues par email pour activer votre compte HRDigitize</p>
        </div>

        {/* Activation Steps */}
        <div className="activation-steps">
          <h3>Instructions :</h3>
          <ol>
            <li>Entrez l'adresse email utilisée lors de l'inscription</li>
            <li>Saisissez le code d'activation reçu par email</li>
            <li>Créez votre mot de passe (minimum 8 caractères)</li>
            <li>Confirmez votre mot de passe</li>
          </ol>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleSubmit} className="activate-form">
          {/* Error Message */}
          {error && <div className="activate-error">{error}</div>}
          
          {/* Success Message */}
          {success && <div className="activate-success">{success}</div>}

          {/* Email Input */}
          <div className="activate-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Activation Code */}
          <div className="activate-input-group code-input-group">
            <label htmlFor="code">Code d'activation</label>
            <input
              id="code"
              type="text"
              name="code"
              placeholder="XXXXXX"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <small className="code-hint">Code à 6 chiffres reçu par email</small>
          </div>

          {/* Password */}
          <div className="activate-input-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <div className="activate-password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="activate-toggle-password-btn"
              >
                {showPassword ? "Cacher" : "Afficher"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="activate-input-group">
            <label htmlFor="passwordConfirmation">Confirmez le mot de passe</label>
            <div className="activate-password-container">
              <input
                id="passwordConfirmation"
                type={showPassword ? "text" : "password"}
                name="passwordConfirmation"
                placeholder="Retapez votre mot de passe"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="activate-submit-btn"
          >
            {loading ? (
              <>
                <span className="activate-loading-spinner"></span>
                Activation en cours...
              </>
            ) : (
              "Activer mon compte"
            )}
          </button>

          {/* Back Link */}
          <div className="activate-back-link">
            <a href="/login">
              ← Retour à la page de connexion
            </a>
          </div>

            <div className="activate-resend-code">
              <p><FaRegClock />Vous n'avez pas reçu le code ?</p>
              <button 
                type="button" 
                onClick={handleResendCode} 
                disabled={loading}
              >
                <FaPaperPlane className="resend-icon" />
                Renvoyer le code d'activation
              </button>
            </div>

        </form>
      </div>
    </div>
  );
}