import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function SocieteArchiveTab() {
  const [societes, setSocietes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedSocietes();
  }, []);

  const fetchArchivedSocietes = async () => {
    try {
      const response = await api.get("/societes?archived=true");
      setSocietes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Chargement des sociétés archivées...</p>
      ) : societes.length === 0 ? (
        <p>Aucune société archivée</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Activité</th>
              <th className="border p-2">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {societes.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.nom}</td>
                <td className="border p-2">{s.activite}</td>
                <td className="border p-2">{s.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
