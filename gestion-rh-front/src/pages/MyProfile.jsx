import { useState, useEffect } from "react";  
import api from "../api/axios";
import "./MyProfile.css";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, 
  FaBuilding, FaUserShield, FaLinkedin, FaGithub, FaFileAlt, FaCamera 
} from "react-icons/fa";
import profile from "../assets/profile.webp";

export default function MyProfile() {
  const [salarie, setSalarie] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [societes, setSocietes] = useState([]);
  const [services, setServices] = useState([]);
  const [originalEmail, setOriginalEmail] = useState("");


  const backendURL = "http://localhost:8000";

  const fetchProfile = async () => {
    try {
  const res = await api.get("/me/employee");
  setSalarie(res.data.data);
} catch (err) {
  console.error(err.response?.data || err);
  alert("Impossible de récupérer votre profil. Contactez l'administrateur.");
}
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    api.get("/societe").then(res => setSocietes(res.data.data ?? res.data ?? []));
  }, []);

  useEffect(() => {
    if (!editData.societe_id) {
      setServices([]);
      return;
    }

    api
      .get(`/service/societe/${editData.societe_id}`)
      .then(res => setServices(res.data || []));
  }, [editData.societe_id]);

  if (!salarie) return <div className="profile-loading">Loading...</div>;

  const isRH = salarie.role === "RH";

  const handleChange = (field, value) => {
  setEditData(prev => ({
    ...prev,
    [field]: value,
  }));
};

  const handleSave = async () => {
  try {

    // EMAIL CONFIRMATION
    if (
      editData.email &&
      editData.email !== originalEmail
    ) {
      const confirmChange = window.confirm(
        "Êtes-vous sûr(e) de vouloir changer votre adresse email ?"
      );

      if (!confirmChange) {
        // User cancelled → revert email
        setEditData(prev => ({
          ...prev,
          email: originalEmail,
        }));
        return;
      }
    }

    const payload = { ...editData };

    // Remove files
    delete payload.photo;
    delete payload.cv;

    // Update text fields first
    const resText = await api.put("/me/employee", payload);

    // Then upload files separately if needed
    const fileData = new FormData();
    if (editData.photo) fileData.append("photo", editData.photo);
    if (editData.cv) fileData.append("cv", editData.cv);

    if (fileData.has("photo") || fileData.has("cv")) {
      fileData.append("_method", "PUT");
      await api.post("/me/employee", fileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setSalarie(resText.data.data);
    setShowEditPanel(false);

    // Inform user AFTER successful update
    if (editData.email !== originalEmail) {
      alert(
        "Votre email a été modifié. Vous devrez vous connecter avec la nouvelle adresse."
      );
      // Optional: force logout
       await api.post("/logout");
       window.location.href = "/login";
    }

  } catch (err) {
    console.error("Update failed:", err.response?.data || err);
  }
};


  const handleDelete = async (field) => {
  if (!window.confirm(`Voulez-vous vraiment supprimer ${field} ?`)) return;

  try {
    const res = await api.post("/me/employee/delete", {
      [`delete_${field}`]: true,
    });

    console.log("DELETE RESPONSE:", res.data);
    setSalarie(res.data.data);
    setShowDeletePanel(false);
    setEditData(prev => ({ ...prev, [field]: null }));

    if (field === "photo") setPhotoPreview(null);

  } catch (err) {
    console.error(err.response?.data || err);
  }
};

const handlePhotoUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("_method", "PUT");

    const res = await api.post("/me/employee", formData);

    setSalarie(res.data.data); 
    setPhotoPreview(null);     
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Erreur lors de l'enregistrement de la photo");
  }
};


  return (
    <div className="profile-container">
      
      {/* =================== PROFILE DISPLAY =================== */}
      <div className="profile-card">
        {/* Avatar */}
        <div className="avatar-wrapper">
          <img
            src={ photoPreview
                ? photoPreview
                : salarie.photo
                ? backendURL + salarie.photo
                : profile
            }
            alt="Avatar"
            className="profile-avatar"
            onClick={() => setShowPreview(true)}
            onError={(e) => (e.target.src = profile)}
          />
          {/* Camera icon (UI only) */}
          <label className="camera-icon">
            <FaCamera />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                  handlePhotoUpload(file);
                }
              }}
            />
          </label>
        </div>

        {/* Name */}
        <h2 className="profile-name">{salarie.prenom} {salarie.nom}</h2>

        {/* Info section (your original code untouched) */}
        <div className="profile-details-container">
          {salarie.societe && (
            <div className="profile-detail-item">
              <p className="profile-societe">{salarie.societe?.nom ?? "-"}</p>
              <label>Société</label>
            </div>
          )}
          {salarie.service && (
            <div className="profile-detail-item">
              <p className="profile-service">{salarie.service?.nom ?? "-"}</p>
              <label>Service</label>
            </div>
          )}
          {salarie.poste && (
            <div className="profile-detail-item">
              <p className="profile-poste">{salarie.poste}</p>
              <label>Poste</label>
            </div>
          )}
        </div>

        <div className="profile-info">
          {salarie.email && (
            <div className="profile-info-item">
              <FaEnvelope className="icon" />
              <span>{salarie.email}</span>
            </div>
          )}
          {salarie.telephone && (
            <div className="profile-info-item">
              <FaPhone className="icon" />
              <span>{salarie.telephone}</span>
            </div>
          )}
          {salarie.adresse && (
            <div className="profile-info-item">
              <FaMapMarkerAlt className="icon" />
              <span>{salarie.adresse}</span>
            </div>
          )}
          {salarie.cin && (
            <div className="profile-info-item">
              <FaIdCard className="icon" />
              <span>{salarie.cin}</span>
            </div>
          )}
          {salarie.linkedin && (
            <div className="profile-info-item">
              <FaLinkedin className="icon" />
              <a href={salarie.linkedin} target="_blank" rel="noreferrer">
                {salarie.linkedin}
              </a>
            </div>
          )}
          {salarie.github && (
            <div className="profile-info-item">
              <FaGithub className="icon" />
              <a href={salarie.github} target="_blank" rel="noreferrer">
                {salarie.github}
              </a>
            </div>
          )}
          {salarie.cv && (
            <div className="profile-info-item">
              <FaFileAlt className="icon" />
              <a href={backendURL + salarie.cv} target="_blank" rel="noreferrer">
                Voir CV
              </a>
            </div>
          )}
        </div>

        {/* RH-only info */}
        {isRH && (
          <>
            <button
              className="show-more-btn"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Masquer RH Info" : "Afficher RH Info"}
            </button>
            {showMore && (
              <div className="profile-more-info">
                
                {salarie.date_embauche && (
                  <div className="profile-info-item">
                    <FaBuilding className="icon" />
                    <span>{salarie.date_embauche}</span>
                  </div>
                )}
                {salarie.status && (
                  <div className="profile-info-item">
                    <FaUserShield className="icon" />
                    <span>{salarie.status}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="action-buttons-container">
   {/* =================== EDIT PANEL =================== */}
<div className="action-panel-wrapper">
  <button
    className="edit-btn"
    onClick={() => {
      setEditData({
        prenom: salarie.prenom,
        nom: salarie.nom,
        email: salarie.email,
        telephone: salarie.telephone,
        adresse: salarie.adresse,
        linkedin: salarie.linkedin,
        github: salarie.github,
        cin: salarie.cin,
        sexe: salarie.sexe,
        // RH fields
        date_embauche: salarie.date_embauche,
        status: salarie.status,
        societe_id: salarie.societe_id,
        service_id: salarie.service_id,
        poste: salarie.poste,

      });
      setOriginalEmail(salarie.email);
      setShowEditPanel(!showEditPanel);
    }}
  >
    {showEditPanel ? "Fermer" : "Modifier"}
  </button>

  {showEditPanel && (
  <>
    <div className="profile-edit-panel">
      <h3>Modifier le Profil</h3>
      <div className="edit-form">
        {/* ===== DYNAMIC COLUMNS LAYOUT ===== */}
        <div className="edit-columns-container">
          {/* COLUMN 1 - Basic Info */}
          <div className="edit-column">
            <div className="edit-input-group">
              <label>Prénom</label>
              <input
                value={editData.prenom || ""}
                onChange={(e) => handleChange("prenom", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>Nom</label>
              <input
                value={editData.nom || ""}
                onChange={(e) => handleChange("nom", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>Téléphone</label>
              <input
                value={editData.telephone || ""}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>Adresse</label>
              <input
                value={editData.adresse || ""}
                onChange={(e) => handleChange("adresse", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>CIN</label>
                <input
                  value={editData.cin || ""}
                  onChange={(e) => handleChange("cin", e.target.value)}
                />
            </div>
          </div>

          {/* COLUMN 2 - Social & Files */}
          <div className="edit-column">
            <div className="edit-input-group">

              <label>Sexe</label>
              <select
                value={editData.sexe || ""}
                onChange={e => handleChange("sexe", e.target.value)}
              >
                <option value="">-- Sélectionner --</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>

              <label>LinkedIn</label>
              <input
                placeholder="https://linkedin.com/in/..."
                value={editData.linkedin || ""}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>GitHub</label>
              <input
                placeholder="https://github.com/..."
                value={editData.github || ""}
                onChange={(e) => handleChange("github", e.target.value)}
              />
            </div>

            <div className="edit-input-group">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("photo", e.target.files[0])}
              />
            </div>

            <div className="edit-input-group">
              <label>CV</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleChange("cv", e.target.files[0])}
              />
            </div>

            {/* ===== RH BASIC FIELDS ===== */}
            {isRH && (
              <>

                <div className="edit-input-group">
                  <label>Date d'embauche</label>
                  <input
                    type="date"
                    value={editData.date_embauche || ""}
                    onChange={(e) =>
                      handleChange("date_embauche", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* COLUMN 3 - RH Only Fields (Organization) */}
          {isRH && (
            <div className="edit-column">
              <div className="edit-input-group">
                <label>Status</label>
                <select
                  value={editData.status || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="status-select"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="actif">Actif</option>
                  <option value="en_conge">En congé</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="demissionne">Démissionné</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>

              <div className="edit-input-group">
                <label>Société</label>
                <select
                  value={editData.societe_id || ""}
                  onChange={(e) => {
                    handleChange("societe_id", e.target.value);
                    handleChange("service_id", "");
                  }}
                >
                  <option value="">Choisir une société</option>
                  {societes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-input-group">
                <label>Service</label>
                <select
                  value={editData.service_id || ""}
                  onChange={(e) => handleChange("service_id", e.target.value)}
                  disabled={!editData.societe_id}
                  className={!editData.societe_id ? "disabled-select" : ""}
                >
                  <option value="">-- Choisir un service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
                {!editData.societe_id && (
                  <small className="select-hint">Sélectionnez d'abord une société</small>
                )}
              </div>

              <div className="edit-input-group">
                <label>Poste</label>
                <input
                  value={editData.poste || ""}
                  onChange={(e) => handleChange("poste", e.target.value)}
                  placeholder="Ex: Développeur Full-Stack"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="edit-actions">
        <button type="button" onClick={handleSave}>Valider</button>
        <button type="button" onClick={() => setShowEditPanel(false)}>Annuler</button>
      </div>
    </div>
  </>
)}
</div>

  {/* =================== DELETE PANEL =================== */}
<div className="action-panel-wrapper">
  <button className="delete-btn" onClick={() => setShowDeletePanel(!showDeletePanel)}>
    {showDeletePanel ? "Fermer" : "Supprimer"}
  </button>

  {showDeletePanel && (
    <div className="delete-panel-overlay">
      <div className="delete-panel-content">
        <h3>Supprimer des éléments</h3>
        <div className="delete-options-grid">
          {salarie.cv && (
            <button className="delete-option-btn" onClick={() => handleDelete("cv")}>
              Supprimer le CV
            </button>
          )}
          {salarie.photo && (
            <button className="delete-option-btn" onClick={() => handleDelete("photo")}>
              Supprimer la photo
            </button>
          )}
          {salarie.linkedin && (
            <button className="delete-option-btn" onClick={() => handleDelete("linkedin")}>
              Supprimer LinkedIn
            </button>
          )}
          {salarie.github && (
            <button className="delete-option-btn" onClick={() => handleDelete("github")}>
              Supprimer GitHub
            </button>
          )}
        </div>
        
        {/* Action button INSIDE the panel content */}
        <div className="delete-panel-actions">
          <button type="button" onClick={() => setShowDeletePanel(false)}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  )}
</div>


      </div>
    </div>
  );
}
