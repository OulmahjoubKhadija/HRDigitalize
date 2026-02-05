import InternUserForm from "../components/forms/InternUserForm";
import { useAuth } from "../context/AuthContext.jsx";

export default function InternProfileCompletion() {

      const { user } = useAuth();
    
      if (!user) {
        return <p>Loading...</p>;
      }

  return (
      <InternUserForm />
    );
}