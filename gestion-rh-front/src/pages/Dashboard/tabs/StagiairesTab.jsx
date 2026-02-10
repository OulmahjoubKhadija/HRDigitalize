import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

import ViewStagiaireModal from "../../../modals/ViewStagiaireModal";
import EditStagiaireModal from "../../../modals/EditStagiaireModal";
import StagiaireDeleteConfirm from "../../../modals/StagiaireDeleteConfirm";

import profile from "../../../assets/profile.webp";

export default function StagiairesTab() {
  const { user } = useAuth();
  const isRH = user?.role === "RH";

  const [stagiaires, setStagiaires] = useState([]);
  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const backendURL = "http://localhost:8000";

  const styles = { photo: { maxWidth: "100px", maxHeight: "200px", borderRadius: "25px", }, };

  /* ===================== FETCH ===================== */
  const fetchStagiaires = async (page = 1, searchQuery = "") => {
    try {
      const res = await api.get("/stagiaires", {
        params: {
          page,
          search: searchQuery,
          per_page: 10,
        },
      });

      setStagiaires(res.data.data);
      setCurrentPage(res.data.meta.current_page);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error("Erreur fetch stagiaires:", err);
    }
  };

  useEffect(() => {
    fetchStagiaires(currentPage, search);
  }, [currentPage, search]);

  /* ===================== ACTIONS ===================== */
  const deleteStagiaire = async (stagiaire) => {
    try {
      await api.delete(`/stagiaires/${stagiaire.id}`);
      fetchStagiaires(currentPage, search);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const openModal = (type, stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedStagiaire(null);
    setActiveModal(null);
  };

  const updateStagiaireInState = (updated) => {
    setStagiaires((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const canEdit = (s) => {
  if (isRH) return true;

  if (["SALARIE", "CHEF_SERVICE"].includes(user.role)) {
    return s.encadrant?.id === user.salarie_id;
  }

  return false;
};

const canDelete = () => isRH;


  /* ===================== TABLE ===================== */
  const renderTable = () => (
    <table className="w-full border mb-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Photo</th>
          <th className="p-2 border">Nom</th>
          <th className="p-2 border">Prénom</th>
          <th className="p-2 border">Société</th>
          <th className="p-2 border">Service</th>
          <th className="p-2 border">Encadrant</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {stagiaires.map((s) => (
          <tr key={s.id}>
            <td className="p-2 border">
              <img src={s.photo ? backendURL + s.photo : profile} onError={(e) => (e.target.src = profile)} style={styles.photo} />
            </td>

            <td className="p-2 border">{s.nom}</td>
            <td className="p-2 border">{s.prenom}</td>
            <td className="p-2 border">{s.societe?.nom ?? "-"}</td>
            <td className="p-2 border">{s.service?.nom ?? "-"}</td>
            <td className="p-2 border">
              {s.encadrant
                ? `${s.encadrant.nom} ${s.encadrant.prenom}`
                : "-"}
            </td>

            <td className="p-2 border space-x-2">
              <button
                className="text-blue-600"
                onClick={() => openModal("view", s)}
              >
                Voir
              </button>

              {canEdit(s) && (
              <button
                className="text-orange-600"
                onClick={() => openModal("edit", s)}
              >
                Modifier
              </button>
            )}

            {canDelete() && (
              <button
                className="text-red-600"
                onClick={() => openModal("delete", s)}
              >
                Supprimer
              </button>
            )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  /* ===================== PAGINATION ===================== */
  const goNext = () => {
    if (currentPage < lastPage) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  /* ===================== JSX ===================== */
  return (
    <>
      {/* Search */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Rechercher par nom, prénom, CIN, société ou service"
          className="input input-bordered w-full max-w-sm"
        />
        <button className="btn btn-primary" onClick={() => fetchStagiaires(search, 1)}>Rechercher</button>
      </div>

      {renderTable()}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className="btn btn-sm"
        >
          Précédent
        </button>

        <span>
          Page {currentPage} / {lastPage}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage === lastPage}
          className="btn btn-sm"
        >
          Suivant
        </button>
      </div>

      {/* Modals */}
      {activeModal === "view" && selectedStagiaire && (
        <ViewStagiaireModal
          stagiaire={selectedStagiaire}
          onClose={closeModal}
        />
      )}

      {activeModal === "edit" && selectedStagiaire && (
        <EditStagiaireModal
          stagiaire={selectedStagiaire}
          onClose={closeModal}
          updateStagiaireInState={updateStagiaireInState}
        />
      )}

      {activeModal === "delete" && selectedStagiaire && (
        <StagiaireDeleteConfirm
          stagiaire={selectedStagiaire}
          onClose={closeModal}
          onConfirm={() => {
            deleteStagiaire(selectedStagiaire);
            closeModal();
          }}
        />
      )}
    </>
  );
}
