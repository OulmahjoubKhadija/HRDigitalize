import { useState } from "react";
import api from "../api/axios";

export default function DeleteSocieteModal({ societe, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!societe) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.delete(`/societes/${societe.id}`);
      onDeleted(societe.id);
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
        <h2 className="text-xl font-bold mb-4">Supprimer Société</h2>
        <p>Êtes-vous sûr de vouloir supprimer <strong>{societe.nom}</strong> ?</p>
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
