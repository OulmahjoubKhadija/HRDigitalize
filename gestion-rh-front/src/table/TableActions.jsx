import usePermissions from "../context/usePermissions";

export default function TableActions({ row, onView, onEdit, onDelete }) {
  const { canEdit, canDelete } = usePermissions();

  return (
    <div className="table-actions">
      <button onClick={() => onView(row)}>👁</button>

      {canEdit(row.user_id || row.id) && (
        <button onClick={() => onEdit(row)}>✏️</button>
      )}

      {canDelete(row.user_id || row.id) && (
        <button onClick={() => onDelete(row)}>🗑</button>
      )}
    </div>
  );
}
