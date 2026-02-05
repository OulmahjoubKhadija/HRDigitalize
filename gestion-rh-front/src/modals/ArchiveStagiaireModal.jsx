import React, { useState } from "react";

export default function ArchiveStagiaireModal({
  stagiaire,
  onClose,
  onRestore,
  onForceDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!stagiaire) return null;

  const handleForceDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    onForceDelete(stagiaire.id);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-lg font-bold mb-3">
          Stagiaire archivé
        </h2>

        <p className="mb-2">
          <strong>{stagiaire.nom} {stagiaire.prenom}</strong> est actuellement archivé.
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Vous pouvez restaurer ce stagiaire ou supprimer définitivement ses données.
        </p>

        {confirmDelete && (
          <p className="text-sm text-red-600 mb-3">
            ⚠️ Cette action est irréversible et supprimera toutes les données du stagiaire.
          </p>
        )}

        <div className="modal-action flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            Fermer
          </button>

          <button
            className="btn btn-success"
            onClick={() => {
              onRestore(stagiaire.id);
              onClose();
            }}
          >
            Restaurer
          </button>

          <button
            className="btn btn-error"
            onClick={handleForceDelete}
          >
            {confirmDelete ? "Confirmer la suppression" : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  );
}
