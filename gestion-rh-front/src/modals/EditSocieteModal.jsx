import { useState, useEffect } from "react";
import { societeService } from "../services/societe.service";

export default function EditSocieteModal({ societe, onClose, updateSocieteInState }) {
  const [form, setForm] = useState({
    nom: "",
    activite: "",
    telephone: "",
    logo: null,
    fax: "",
    adresse: "",
    ice: "",
    rc: "",
    cnss: "",
    if: "",
    patente: "",
  });

  useEffect(() => {
    if (societe) {
      setForm({
        nom: societe.nom || "",
        activite: societe.activite || "",
        telephone: societe.telephone || "",
        logo: null,
        fax: societe.fax || "",
        adresse: societe.adresse || "",
        ice: societe.ice || "",
        rc: societe.rc || "",
        cnss: societe.cnss || "",
        if: societe.if || "",
        patente: societe.patente || "",
      });
    }
  }, [societe]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, logo: e.target.files[0] });

  const handleSubmit = async () => {
  try {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        if (key === "logo" && !(value instanceof File)) return;
        payload.append(key, value);
      }
    });

    const updated = await societeService.update(
      societe.id,
      payload
    );

    updateSocieteInState(updated.societe);
    onClose();
  } catch (err) {
    console.error(err.response?.data || err);
  }
};


  return (
    <div className="modal">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Modifier société</h2>

        <label>Nom: </label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          className="input input-bordered w-full mb-2"
        />

        <label>Activite: </label>
        <input
          name="activite"
          value={form.activite}
          onChange={handleChange}
          placeholder="Activité"
          className="input input-bordered w-full mb-2"
        />

        <label>Téléphone: </label>
        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="input input-bordered w-full mb-2"
        />

        <label>Fax: </label>
        <input
          name="fax"
          value={form.fax}
          onChange={handleChange}
          placeholder="Fax"
          className="input input-bordered w-full mb-2"
        />

        <label>Address: </label>
        <input
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
          placeholder="Adresse"
          className="input input-bordered w-full mb-2"
        />

        <label>Logo: </label>
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className="input input-bordered w-full mb-2"
        />

        <label>ICE: </label>
        <input
          name="ice"
          value={form.ice}
          onChange={handleChange}
          placeholder="ICE"
          className="input input-bordered w-full mb-2"
        />

        <label>RC: </label>
        <input
          name="rc"
          value={form.rc}
          onChange={handleChange}
          placeholder="RC"
          className="input input-bordered w-full mb-2"
        />

        <label>CNSS: </label>
        <input
          name="cnss"
          value={form.cnss}
          onChange={handleChange}
          placeholder="CNSS"
          className="input input-bordered w-full mb-2"
        />

        <label>IF: </label>
        <input
          name="if"
          value={form.if}
          onChange={handleChange}
          placeholder="IF"
          className="input input-bordered w-full mb-2"
        />

        <label>Patente: </label>
        <input
          name="patente"
          value={form.patente}
          onChange={handleChange}
          placeholder="Patente"
          className="input input-bordered w-full mb-2"
        />

        <div className="text-right">
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
