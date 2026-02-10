import { useState } from "react";
import api from "../api/axios";

export default function DeleteServiceModal({ service, onClose, onConfirm }) {

  if (!service) return null;


  return (
    <div className="modal">
      <div className="modal-box max-w-md">
        <h2 className="text-xl font-bold mb-4">Archiver Service</h2>
        <p>Êtes-vous sûr de vouloir Archiver <strong>{service.nom}</strong> ?</p>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => {onConfirm(service); onClose();}}
          >
            Archiver
          </button>
        </div>
      </div>
    </div>
  );
}
