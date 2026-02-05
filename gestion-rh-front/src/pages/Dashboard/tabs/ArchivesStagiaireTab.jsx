import { useState } from "react";
import api from "../../../api/axios";
import ArchiveStagiaireModal from "../../../modals/ArchiveStagiaireModal";
import profile from "../../../assets/profile.webp";

export default function ArchivesSalarieTab({ stagiaires }) {
  const [selected, setSelected] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const backendURL = "http://localhost:8000";
  const styles = {
    photo: {
      maxWidth: "100px",
      maxHeight: "200px",
      borderRadius: "25px",
    }
  }

  const restoreStagiaire = async (id) => {
    await api.patch(`/stagiaires/${id}/restore`);
  };

  const forceDeleteStagiaire = async (id) => {
    await api.delete(`/stagiaires/${id}/force`);
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>CIN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stagiaires.map((s) => (
            <tr key={s.id}>
               <td className="p-2 border">
                <img src={ photoPreview ? photoPreview : s.photo ? backendURL + s.photo : profile}
                    onError={(e) => e.target.src = profile}
                    style={styles.photo}/></td> 
              <td>{s.nom}</td>
              <td>{s.prenom}</td>
              <td>{s.cin}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => setSelected(s)}
                >
                  Gérer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <ArchiveStagiaireModal
          salarie={selected}
          onClose={() => setSelected(null)}
          onRestore={restoreStagiaire}
          onForceDelete={forceDeleteStagiaire}
        />
      )}
    </>
  );
}
