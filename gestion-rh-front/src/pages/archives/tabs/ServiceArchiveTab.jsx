import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function ServiceArchiveTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedServices();
  }, []);

  const fetchArchivedServices = async () => {
    try {
      const response = await api.get("/services?archived=true");
      setServices(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Chargement des services archivés...</p>
      ) : services.length === 0 ? (
        <p>Aucun service archivé</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Société</th>
              <th className="border p-2">Nombre d'utilisateurs</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.nom}</td>
                <td className="border p-2">{s.societe?.nom ?? "-"}</td>
                <td className="border p-2">{s.users?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
