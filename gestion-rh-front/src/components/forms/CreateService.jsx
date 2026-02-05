import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Service.css";

export default function CreateService() {
  const [formData, setFormData] = useState({
    nom: "",
    societe_id: "",
  });

  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/societe")
      .then(res => setSocietes(res.data.data ?? res.data))
      .catch(() => setErrors({ global: "Impossible de charger les sociétés." }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await api.post("/service", formData);
      setSuccess("Service créé avec succès !");
      setFormData({ nom: "", societe_id: "" });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ global: "Erreur lors de la création du service." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form-container">
      {/* Messages Container */}
      {errors.global && (
        <div className="service-error-message">
            <div className="message-content">
                {errors.global}
            </div>
          <button 
            type="button" 
            className="message-close-btn"
            onClick={() => setErrors({})}
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="service-success-message">
          <div className="message-content">
                {success}
            </div>
          <button 
            type="button" 
            className="message-close-btn"
            onClick={() => setSuccess("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="service-form-card">
        {/* Form Header */}
        <div className="service-form-header">
          <h2>Créer un service</h2>
          <p>Remplissez les informations ci-dessous pour ajouter un nouveau service au système.</p>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          {/* Side-by-Side Fields */}
          <div className="service-fields-row">
            {/* Service Name */}
            <div className="service-input-group">
              <label className="service-required-field">Nom du service</label>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <span className="service-field-description">Nom complet du service à créer</span>
            </div>

            {/* Société Selection */}
            <div className="service-input-group">
              <label className="service-required-field">Société</label>
              <select
                name="societe_id"
                value={formData.societe_id}
                onChange={handleChange}
                required
              >
                <option value=""> Sélectionner une société </option>
                {societes.map(s => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
              <span className="service-field-description">Société à laquelle rattacher ce service</span>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="service-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="service-loading-spinner"></span>
                Création...
              </>
            ) : "Créer le service"}
          </button>
        </form>
      </div>
    </div>
  );
}