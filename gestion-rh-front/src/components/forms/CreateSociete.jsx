import { useState } from "react";
import api from "../../api/axios";
import "./Societe.css";

export default function CreateSociete() {
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    fax: "",
    activite: "",
    if: "",
    cnss: "",
    rc: "",
    ice: "",
    patente: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    await api.post("/societe", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setSuccess("Société créée avec succès !");

    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      fax: "",
      activite: "",
      logo: null,
      if: "",
      cnss: "",
      rc: "",
      ice: "",
      patente: "",
    });

  } catch (err) {
    if (err.response?.status === 422) {
      setErrors(err.response.data.errors || {});
    } else {
      setErrors({ global: "Erreur lors de la création de la société." });
    }
  } finally {
    setLoading(false);
  }
};


  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData(prev => ({ ...prev, logo: file }));
};

  return (
    <div className="company-form-container">
      {/* Messages Container */}
      <div className="company-messages-container">
        {errors.global && (
            <div className="company-error-message">
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
            <div className="company-success-message">
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
    </div>

      {/* Form Card */}
      <div className="company-form-card">
        {/* Form Header */}
        <div className="company-form-header">
          <h2>Créer une société</h2>
          <p>Remplissez les informations ci-dessous pour ajouter une nouvelle société au système.</p>
        </div>

        <form onSubmit={handleSubmit} className="company-form">
            {/* Side-by-Side Sections */}
            <div className="company-sections-row">
                {/* Informations Principales (Left Column) */}
                <div className="company-section">
                    <h3 className="company-section-title">Informations Principales</h3>
                
                    {/* Nom */}
                    <div className="company-input-group">
                        <label className="company-required-field">Nom</label>
                        <input 
                        name="nom" 
                        placeholder="Nom de la société"
                        value={formData.nom} 
                        onChange={handleChange} 
                        required 
                        />
                        <span className="company-field-description">Nom officiel de la société</span>
                    </div>

                    {/* Adresse */}
                    <div className="company-input-group">
                        <label className="company-required-field">Adresse</label>
                        <input 
                        name="adresse" 
                        placeholder="Adresse complète"
                        value={formData.adresse} 
                        onChange={handleChange} 
                        required 
                        />
                        <span className="company-field-description">Adresse du siège social</span>
                    </div>

                    {/* Logo */}
                    <div className="company-input-group">
                            <label className="company-required-field">Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required 
                            />
                            <span className="company-field-description">
                                Logo requis – utilisé pour la génération des documents officiels
                            </span>
                            <span className="company-warning-text">
                                ⚠️ Format recommandé : PNG ou SVG avec fond transparent.
                                Un fond blanc est accepté.
                            </span>
                    </div>

                    {/* Activité */}
                    <div className="company-input-group">
                        <label>Activité</label>
                        <input 
                        name="activite" 
                        placeholder="Secteur d'activité"
                        value={formData.activite} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Domaine d'activité principal</span>
                    </div>

                    <h3 className="company-section-title">Informations de Contact</h3>
                
                    {/* Téléphone */}
                    <div className="company-input-group">
                        <label className="company-required-field">Téléphone</label>
                        <input 
                        name="telephone" 
                        placeholder="Numéro de téléphone"
                        value={formData.telephone} 
                        onChange={handleChange} 
                        required 
                        />
                        <span className="company-field-description">Téléphone principal</span>
                    </div>

                    {/* Fax */}
                    <div className="company-input-group">
                        <label>Fax</label>
                        <input 
                        name="fax" 
                        placeholder="Numéro de fax"
                        value={formData.fax} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Numéro de fax si disponible</span>
                    </div>
                </div>

                {/* Informations de Contact (Right Column) */}
                <div className="company-section">
                    <h3 className="company-section-title">Informations Fiscales</h3>
            
                
                    {/* Row of fiscal inputs */}
                    <div className="company-input-group">
                        <label>IF</label>
                        <input 
                        name="if" 
                        placeholder="Identifiant Fiscal"
                        value={formData.if} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Numéro d'identification fiscale</span>
                    </div>

                    <div className="company-input-group">
                        <label>CNSS</label>
                        <input 
                        name="cnss" 
                        placeholder="Numéro CNSS"
                        value={formData.cnss} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Numéro de sécurité sociale</span>
                    </div>

                    <div className="company-input-group">
                        <label>RC</label>
                        <input 
                        name="rc" 
                        placeholder="Registre de Commerce"
                        value={formData.rc} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Numéro de registre de commerce</span>
                    </div>

                    <div className="company-input-group">
                        <label>ICE</label>
                        <input 
                        name="ice" 
                        placeholder="Identifiant Commun d'Entreprise"
                        value={formData.ice} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Identifiant unique d'entreprise</span>
                    </div>

                    <div className="company-input-group">
                        <label>Patente</label>
                        <input 
                        name="patente" 
                        placeholder="Numéro de patente"
                        value={formData.patente} 
                        onChange={handleChange} 
                        />
                        <span className="company-field-description">Numéro de patente municipale</span>
                    </div>
                
                </div>
            </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="company-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="company-loading-spinner"></span>
                Création...
              </>
            ) : "Créer la société"}
          </button>
        </form>
      </div>
    </div>
  );
}