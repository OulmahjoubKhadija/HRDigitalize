import { useState } from "react";
import api from "../../../api/axios";
import ArchiveSalarieModal from "../../../modals/ArchiveSalarieModal";

export default function ArchivesSalarieTab({ salaries }) {
  const [selected, setSelected] = useState(null);

  const restoreSalarie = async (id) => {
    await api.patch(`/salaries/${id}/restore`);
  };

  const forceDeleteSalarie = async (id) => {
    await api.delete(`/salaries/${id}/force`);
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>CIN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s) => (
            <tr key={s.id}>
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
        <ArchiveSalarieModal
          salarie={selected}
          onClose={() => setSelected(null)}
          onRestore={restoreSalarie}
          onForceDelete={forceDeleteSalarie}
        />
      )}
    </>
  );
}
