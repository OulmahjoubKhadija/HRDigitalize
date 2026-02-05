import { useEffect, useState } from "react";
import api from "../../../api/axios";

import profile from "../../../assets/profile.webp";
export default function StagiairesArchiveTab() {
  const [stagiaires, setStagiaires] = useState([]);

  const backendURL = "http://localhost:8000";


  const [photoPreview, setPhotoPreview] = useState(null);
      
  const styles = {
        photo: {
            maxWidth: "100px",
            maxHeight: "200px",
            borderRadius: "25px",
        }
    }

  useEffect(() => {
    api.get("/stagiaires/archives").then(res => {
      setStagiaires(res.data.data);
    });
  }, []);

  const restore = async (id) => {
    await api.patch(`/stagiaires/${id}/restore`);
    setStagiaires(prev => prev.filter(s => s.id !== id));
  };

  const forceDelete = async (id) => {
    if (!confirm("⚠️ Suppression définitive.")) return;
    if (!confirm("Dernier avertissement.")) return;

    await api.delete(`/stagiaires/${id}/force`);
    setStagiaires(prev => prev.filter(s => s.id !== id));
  };

  /* 🟢 EMPTY STATE */
  if (stagiaires.length === 0) {
    return (
      <h1 className="text-center text-gray-500 text-lg mt-10">
        Aucun stagiaire archivé pour le moment
      </h1>
    );
  }

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Photo</th>
          <th className="p-2 border">CIN</th>
          <th className="p-2 border">Nom</th>
          <th className="p-2 border">Prénom</th>
          <th className="p-2 border">Société</th>
          <th className="p-2 border">Service</th>
          <th className="p-2 border">Encadrant</th>
          <th className="p-2 border">Filière</th>
          <th className="p-2 border">Téléphone</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Début de stage</th>
          <th className="p-2 border">Fin de stage</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {stagiaires.map(s => (
          <tr key={s.id}>
            <td className="p-2 border">
                <img src={ photoPreview ? photoPreview : s.photo ? backendURL + s.photo : profile}
                    onError={(e) => e.target.src = profile}
                    style={styles.photo}/></td>
            <td className="p-2 border">{s.cin}</td>
            <td className="p-2 border">{s.nom}</td>
            <td className="p-2 border">{s.prenom}</td>
            <td className="p-2 border">{s.societe?.nom ?? "-"}</td>
            <td className="p-2 border">{s.service?.nom ?? "-"}</td>
            <td className="p-2 border">{s.encadrant ? `${s.encadrant.nom} ${s.encadrant.prenom}` : "-"}</td>
            <td className="p-2 border">{s.filier?? "-"}</td>
            <td className="p-2 border">{s.telephon?? "-"}</td>
            <td className="p-2 border">{s.email}</td>
            <td className="p-2 border">{s.date_debut?? "-"}</td>
            <td className="p-2 border">{s.date_fin?? "-"}</td>

            <td className="p-2 border space-x-3">
              <button
                className="text-green-600"
                onClick={() => restore(s.id)}
              >
                Restaurer
              </button>

              <button
                className="text-red-600"
                onClick={() => forceDelete(s.id)}
              >
                Supprimer définitivement
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

