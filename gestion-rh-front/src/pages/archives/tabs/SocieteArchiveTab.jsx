import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function SocieteArchiveTab() {
  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:8000";

    const [logoPreview, setLogoPreview] = useState(null);

    const styles = {
    photo: {
      maxWidth: "140px",
      maxHeight: "180px",
    }
  }

  const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  useEffect(() => {
    fetchArchivedSocietes();
  }, []);

  const fetchArchivedSocietes = async () => {
    try {
      const response = await api.get("/societe/archives");
      setSocietes(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restore = async (id) => {
    try{
      const res = await api.patch(`/societe/${id}/restore`);
      setSocietes(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.res?.data?.data?.message || "Erreur lors de la restaurations");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Chargement des sociétés archivées...</p>
      ) : societes.length === 0 ? (
        <h1>Aucune société archivée</h1>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">LOGO</th>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Activité</th>
              <th className="border p-2">Adresse</th>
              <th className="border p-2">Téléphone</th>
              <th className="border p-2">fax</th>
              <th className="border p-2">IF</th>
              <th className="border p-2">RC</th>
              <th className="border p-2">CNSS</th>
              <th className="border p-2">ICE</th>
              <th className="border p-2">PATENTE</th>
              <th className="border p-2">Archivé le</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {societes.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.logo && (
            <img src={ logoPreview ? logoPreview : s.logo
              ? backendURL + s.logo : "Le logo n'a pas été inséré."
            } alt="Le logo n'a pas été inséré." className="h-20" style={styles.photo} />
        )}</td>
                <td className="border p-2">{s.nom}</td>
                <td className="border p-2">{s.email ?? "-"}</td>
                <td className="border p-2">{s.activite ?? "-"}</td>
                <td className="border p-2">{s.adresse ?? "-"}</td>
                <td className="border p-2">{s.telephone ?? "-"}</td>
                <td className="border p-2">{s.fax ?? "-"}</td>
                <td className="border p-2">{s.if ?? "-"}</td>
                <td className="border p-2">{s.rc ?? "-"}</td>
                <td className="border p-2">{s.cnss ?? "-"}</td>
                <td className="border p-2">{s.ice ?? "-"}</td>
                <td className="border p-2">{s.patente ?? "-"}</td>
                <td className="border p-2 text-center text-sm text-gray-600 italic">
                  {formatDate(s.archived_at)}
                </td>
                <td className="border p-2">
                  <button className="text-green-600" onClick={() => restore(s.id)}>
                    Restaurer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
