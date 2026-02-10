import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ServiceArchiveTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchArchivedServices();
  }, []);

  const fetchArchivedServices = async () => {
    try {
      const response = await api.get("/service/archives");
      setServices(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const restore = async (id) => {
    try{
      const res = await api.patch(`/service/${id}/restore`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.res?.data?.data?.message || "Erreur lors de la restaurations");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Chargement des services archivés...</p>
      ) : services.length === 0 ? (
        <h1>Aucun service archivé</h1>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Société</th>
              <th className="border p-2">Archivé le</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.nom}</td>
                <td className="border p-2">{s.societe?.nom ?? "-"}</td>
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
