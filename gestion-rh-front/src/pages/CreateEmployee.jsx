import RoleGuard from "../components/RoleGuard.jsx";
import EmployeeForm from "../components/forms/EmployeeForm.jsx";
import "../pages/CreateEmployee.css";

export default function CreateEmployee() {
  return (
    <RoleGuard roles={["RH"]}>
      <EmployeeForm />
    </RoleGuard>
  );
}
