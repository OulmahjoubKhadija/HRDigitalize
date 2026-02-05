import { useState } from "react";
import api from "../api/axios";

export default function ResendActivationCode() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/resend-activation", { email });
      alert(res.data.message);
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Impossible d’envoyer le code");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Renvoyer le code d’activation</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button>Envoyer</button>
    </form>
  );
}
