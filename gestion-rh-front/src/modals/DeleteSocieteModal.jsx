export default function DeleteSocieteModal({ societe, onClose, onConfirm }) {
  if (!societe) return null;

  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-xl font-bold mb-4">Archiver Société</h2>
        <p>
          Êtes-vous sûr de vouloir archiver <strong>{societe.nom}</strong> ?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={onClose}>
            Annuler
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {onConfirm(societe); onClose();}}
          >
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}

