import { useEffect, useState } from "react";
import api from "../../../api/axios";
import profile from "../../../assets/profile.webp";

export default function SalariesArchiveTab() {
  const [salaries, setSalaries] = useState([]);
  const backendURL = "http://localhost:8000";

  const styles = {
    photo: { maxWidth: "100px", maxHeight: "200px", borderRadius: "25px" },
  };

  // Fetch archives from backend
  const fetchArchives = async () => {
    try {
      const res = await api.get("/salaries/archives");
      setSalaries(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors du fetch archives :", err);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  // Restore salarié
  const restore = async (id) => {
    try {
      const res = await api.patch(`/salaries/${id}/restore`);
      // Remove restored salarié immediately
      setSalaries(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la restauration");
    }
  };

  // Force delete salarié
  const forceDelete = async (id) => {
    if (!confirm("⚠️ Suppression définitive. Aucune restauration possible.")) return;
    if (!confirm("Dernier avertissement. Continuer ?")) return;

    try {
      await api.delete(`/salaries/${id}/force`);
      setSalaries(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression définitive");
    }
  };

  if (salaries.length === 0) {
    return (
      <h1 className="text-center text-gray-500 text-lg mt-10">
        Aucun salarié archivé pour le moment
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
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {salaries.map((s) => (
          <tr key={s.id}>
            <td className="p-2 border">
              <img
                src={s.photo ? backendURL + s.photo : profile}
                onError={(e) => (e.target.src = profile)}
                style={styles.photo}
              />
            </td>
            <td className="p-2 border">{s.cin}</td>
            <td className="p-2 border">{s.nom}</td>
            <td className="p-2 border">{s.prenom}</td>
            <td className="p-2 border">{s.societe?.nom ?? "-"}</td>
            <td className="p-2 border">{s.service?.nom ?? "-"}</td>
            <td className="p-2 border space-x-3">
              <button className="text-green-600" onClick={() => restore(s.id)}>
                Restaurer
              </button>
              <button className="text-red-600" onClick={() => forceDelete(s.id)}>
                Supprimer définitivement
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
