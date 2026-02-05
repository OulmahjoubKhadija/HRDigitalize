import { useState } from "react";
import api from "../api/axios";

export default function DeleteServiceModal({ service, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!service) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await api.delete(`/services/${service.id}`);
      onDeleted(service.id);
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-xl font-bold mb-4">Supprimer Service</h2>
        <p>Êtes-vous sûr de vouloir supprimer <strong>{service.nom}</strong> ?</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
