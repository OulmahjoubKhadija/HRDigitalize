import { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditServiceModal({ service, onClose, updateServiceInState }) {
  const [form, setForm] = useState({
    nom: "",
    societe_id: "",
  });
  const [societes, setSocietes] = useState([]);

  // Load societes for select dropdown
  useEffect(() => {
    api.get("/societe")
      .then((res) => setSocietes(res.data.data ?? res.data))
      .catch(err => console.error(err));
  }, []);

  // Initialize form when service changes
  useEffect(() => {
    if (service) {
      setForm({
        nom: service.nom || "",
        societe_id: service.societe_id || "",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      const res = await api.put(`/service/${service.id}`, payload);

      // Get updated service from response
      let updatedService = res.data.service ?? res.data;

      // Attach full societe object from the dropdown array
      updatedService.societe = societes.find(s => s.id === Number(updatedService.societe_id)) || null;

      // Update parent state immediately
      updateServiceInState(updatedService);

      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response?.data || err);
    }
  };

  if (!service) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Modifier Service</h2>

        <label>Nom: </label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom du service"
          className="input input-bordered w-full mb-2"
        />

        <label>Société: </label>
        <select
          name="societe_id"
          value={form.societe_id}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
        >
          <option value="">Sélectionnez une société</option>
          {societes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nom}
            </option>
          ))}
        </select>

        <div className="text-right mt-4">
          <button className="btn mr-2" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
