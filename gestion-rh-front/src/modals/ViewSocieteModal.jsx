import Field from "../components/common/Field";
import { useState } from "react";
export default function ViewSocieteModal({ societe, onClose }) {
  if (!societe) return null;

    const backendURL = "http://localhost:8000";

    const [logoPreview, setLogoPreview] = useState(null);

    const styles = {
    photo: {
      maxWidth: "250px",
      maxHeight: "270px",
    }
  }

  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Détails de la société</h2>

        <Field label="Nom: " value={societe.nom} />
        <Field label="Activité: " value={societe.activite} />
        <Field label="Téléphone: " value={societe.telephone} />
        <Field label="Fax: " value={societe.fax} />
        <Field label="Adresse: " value={societe.adresse} />

        {"if" in societe && <Field label="IF: " value={societe.if} />}
        {"cnss" in societe && <Field label="CNSS: " value={societe.cnss} />}
        {"rc" in societe && <Field label="RC: " value={societe.rc} />}
        {"ice" in societe && <Field label="ICE: " value={societe.ice} />}
        {"patente" in societe && (
          <Field label="Patente" value={societe.patente} />
        )}
       
       <label h>Logo: </label>
        {societe.logo && (
          <div className="mt-3">
            <img src={ logoPreview ? logoPreview : societe.logo
              ? backendURL + societe.logo : "Le logo n'a pas été inséré."
            } alt="Le logo n'a pas été inséré." className="h-20" style={styles.photo} />
          </div>
        )}

        <div className="mt-4 text-right">
          <button className="btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
