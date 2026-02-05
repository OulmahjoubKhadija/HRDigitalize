export default function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-1">
      <span className="font-medium">{label}</span>
      <span>{value ?? "-"}</span>
    </div>
  );
}
