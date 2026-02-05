import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";

import ViewSocieteModal from "../../../modals/ViewSocieteModal";
import EditSocieteModal from "../../../modals/EditSocieteModal";
import DeleteConfirm from "../../../modals/DeleteSocieteModal";

export default function SocieteTab({ deleteSociete }) {
  const { user } = useAuth();
  const isRH = user?.role === "RH";

  const [selectedSociete, setSelectedSociete] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [societes, setSocietes] = useState([]);

  useEffect(() => {
    api.get("/societe")
      .then((res) => setSocietes(res.data.data ?? res.data))
      .catch(err => console.error(err));
  }, []);

  const openModal = (type, societe) => {
    setSelectedSociete(societe);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedSociete(null);
    setActiveModal(null);
  };
  const updateSocieteInState = (updatedSociete) => {
    setSocietes((prev) =>
      prev.map((s) =>
        s.id === updatedSociete.id
          ? { ...updatedSociete, logo: updatedSociete.logo ?? s.logo }
          : s
      )
    );
  };


  return (
    <>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Activité</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {societes.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.nom}</td>
              <td className="p-2 border">{s.activite ?? "-"}</td>

              <td className="p-2 border space-x-3">
                {/* Voir – everyone */}
                <button
                  className="text-blue-600"
                  onClick={() => openModal("view", s)}
                >
                  Voir
                </button>

                {/* Modifier – RH only */}
                {isRH && (
                  <button
                    className="text-orange-600"
                    onClick={() => openModal("edit", s)}
                  >
                    Modifier
                  </button>
                )}

                {/* Supprimer – RH only */}
                {isRH && (
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

      {/* VIEW */}
      {activeModal === "view" && (
        <ViewSocieteModal
          societe={selectedSociete}
          onClose={closeModal}
        />
      )}

      {/* EDIT */}
      {activeModal === "edit" && (
        <EditSocieteModal
          societe={selectedSociete}
          onClose={closeModal}
          updateSocieteInState={updateSocieteInState}
        />
      )}

      {/* DELETE */}
      {activeModal === "delete" && (
        <DeleteConfirm
          title="Supprimer la société"
          message={`Voulez-vous vraiment supprimer "${selectedSociete?.nom}" ?`}
          onConfirm={() => {
            deleteSociete(selectedSociete.id);
            closeModal();
          }}
          onCancel={closeModal}
        />
      )}
    </>
  );
}