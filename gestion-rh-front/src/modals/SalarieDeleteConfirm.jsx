import React from "react";

export default function SalarieDeleteConfirm({
  salarie,
  onClose,
  onConfirm,
}) {
  if (!salarie) return null;

  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-lg font-bold mb-3">
          Confirmer la suppression
        </h2>

        <p className="mb-2">
          Voulez-vous vraiment archiver le salarié :
        </p>

        <p className="font-semibold mb-3">
          {salarie.nom} {salarie.prenom}
        </p>

        <p className="text-sm text-gray-500">
          Le salarié sera déplacé vers les archives et pourra être restauré plus tard.
        </p>

        <div className="modal-action flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={onClose}>
            Annuler
          </button>

          <button
            className="btn btn-error"
            onClick={() => {
              onConfirm(salarie);
              onClose();
            }}
          >
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}
