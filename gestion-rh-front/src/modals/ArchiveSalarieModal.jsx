import React, { useState } from "react";

export default function ArchiveSalarieModal({
  salarie,
  onClose,
  onRestore,
  onForceDelete,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!salarie) return null;

  const handleForceDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    onForceDelete(salarie.id);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-lg font-bold mb-3">
          Salarié archivé
        </h2>

        <p className="mb-2">
          <strong>{salarie.nom} {salarie.prenom}</strong> est actuellement archivé.
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Vous pouvez soit restaurer ce salarié, soit le supprimer définitivement.
        </p>

        {confirmDelete && (
          <p className="text-sm text-red-600 mb-3">
            ⚠️ Attention : cette action est irréversible.  
            Toutes les données du salarié seront supprimées définitivement.
          </p>
        )}

        <div className="modal-action flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            Fermer
          </button>

          <button
            className="btn btn-success"
            onClick={() => {
              onRestore(salarie.id);
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
