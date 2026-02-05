import RoleGuard from "../components/RoleGuard.jsx";
import InternForm from "../components/forms/InternForm.jsx";

export default function CreateIntern() {
  return (
    <RoleGuard roles={["RH", "SALARIE", "CHEF_SERVICE"]}>
      <div className="max-w-2xl mx-auto p-6">

        <InternForm />
      </div>
    </RoleGuard>
  );
}