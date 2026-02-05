import RoleGuard from "../components/RoleGuard.jsx";
import EmployeeForm from "../components/forms/EmployeeForm.jsx";
import UserProfileForm from "../components/forms/UserProfileForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../pages/ProfileCompletion.css";

export default function ProfileCompletion() {
    const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
      <UserProfileForm/>
    );
}