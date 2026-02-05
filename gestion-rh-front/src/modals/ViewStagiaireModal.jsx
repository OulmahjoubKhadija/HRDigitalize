import profile from "../assets/profile.webp";
import { useState } from "react";

export default function ViewStagiaireModal({ stagiaire, onClose }) {
  if (!stagiaire) return null;

    const backendURL = "http://localhost:8000";
  
    const cvUrl = stagiaire.cv?.startsWith("http") ? stagiaire.cv : `${backendURL}${stagiaire.cv}`;
    const demande_stageUrl = stagiaire.demande_stage?.startsWith("http") ? stagiaire.demande_stage : `${backendURL}${stagiaire.demande_stage}`;
    const fiche_reussiteUrl = stagiaire.cfiche_reussite?.startsWith("http") ? stagiaire.fiche_reussite : `${backendURL}${stagiaire.fiche_reussite}`;
    const accord_stageUrl = stagiaire.accord_stage?.startsWith("http") ? stagiaire.accord_stage : `${backendURL}${stagiaire.accord_stage}`;
    const entreprise_accueilUrl = stagiaire.entreprise_accueil?.startsWith("http") ? stagiaire.entreprise_accueil : `${backendURL}${stagiaire.entreprise_accueil}`;
    
  
    const [photoPreview, setPhotoPreview] = useState(null);
  
    const styles = {
      photo: {
        maxWidth: "150px",
        maxHeight: "250px",
        borderRadius: "100px",
      }
    }

  return (
    <div className="modal">
      <div className="modal-box max-w-xl">
        <h2 className="text-xl font-bold mb-4">Détails du stagiaire</h2>

        {stagiaire.photo && (
            <img src={ photoPreview ? photoPreview : stagiaire.photo 
                ? backendURL + stagiaire.photo : profile}
                onError={(e) => e.target.src = profile}
                style={styles.photo}
            />
        )}

        <div className="grid grid-cols-2 gap-2 mb-2">
           {stagiaire.cin &&(<p><strong>CIN: </strong> {stagiaire.cin ?? "-"}</p>)}
           <p><strong>Nom: </strong> {stagiaire.nom}</p>
           <p><strong>Prénom: </strong> {stagiaire.prenom}</p>
           {stagiaire.email &&(<p><strong>Email: </strong> {stagiaire.email ?? "-"}</p>)}
           {stagiaire.telephone &&(<p><strong>Téléphone: </strong> {stagiaire.telephone ?? "-"}</p>)}
           {stagiaire.filiere &&(<p><strong>Filière: </strong> {stagiaire.filiere ?? "-"}</p>)}
           {stagiaire.status &&(<p><strong>Status: </strong> {stagiaire.status ?? "-"}</p>)}
           <p><strong>Date début: </strong> {stagiaire.date_debut ?? "-"}</p>
           <p><strong>Date fin: </strong> {stagiaire.date_fin ?? "-"}</p>
           <p><strong>Société: </strong> {stagiaire.societe?.nom ?? "-"}</p>
           <p><strong>Service: </strong> {stagiaire.service?.nom ?? "-"}</p>
           <p><strong>Encadrant: </strong> {stagiaire.encadrant ? `${stagiaire.encadrant.nom} ${stagiaire.encadrant.prenom}` : "-"}</p>
           {stagiaire.cv &&(<p>
                <strong>CV: </strong>
                <a href={cvUrl} target="_blank" rel="noreferrer" download className="link link-primary" >
                    Voir le CV
                </a>
            </p>)}
            {stagiaire.demande_stage &&(<p>
                <strong>Demande de stage: </strong>
                <a href={demande_stageUrl} target="_blank" rel="noreferrer" download className="link link-primary" >
                    Voir la Demande de stage
                </a>
            </p>)}
            {stagiaire.fiche_reussite &&(<p>
                <strong>Fiche de reussite: </strong>
                <a href={fiche_reussiteUrl} target="_blank" rel="noreferrer" download className="link link-primary" >
                    Fiche de reussite
                </a>
            </p>)}
            {stagiaire.accord_stage &&(<p>
                <strong>Accord de stage: </strong>
                <a href={accord_stageUrl} target="_blank" rel="noreferrer" download className="link link-primary" >
                    Fiche de reussite
                </a>
            </p>)}
            {stagiaire.entreprise_accueil &&(<p>
                <strong>Entreprise de accueil: </strong>
                <a href={entreprise_accueilUrl} target="_blank" rel="noreferrer" download className="link link-primary" >
                    Fiche de reussite
                </a>
            </p>)}
        </div>

        <div className="text-right">
          <button className="btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
