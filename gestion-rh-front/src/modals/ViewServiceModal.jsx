export default function ViewServiceModal({ service, onClose }) {
  if (!service) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Détails du Service</h2>

        <div className="mb-2">
          <strong>Nom :</strong> {service.nom}
        </div>

        <div className="mb-2">
          <strong>Société :</strong> {service.societe?.nom ?? "-"}
        </div>

        <div className="text-right mt-4">
          <button className="btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
