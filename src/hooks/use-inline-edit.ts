import { useState } from "react";

interface EditingCell {
  id: string;
  field: string;
}

interface UseInlineEditReturn {
  editingCell: EditingCell | null;
  editValue: string;
  isEditing: (id: string, field: string) => boolean;
  startEdit: (id: string, field: string, currentValue: string) => void;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent, onSave: () => void) => void;
  setEditValue: (value: string) => void;
}

export function useInlineEdit(): UseInlineEditReturn {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState("");

  const isEditing = (id: string, field: string) =>
    editingCell?.id === id && editingCell?.field === field;

  const startEdit = (id: string, field: string, currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, onSave: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return { editingCell, editValue, isEditing, startEdit, cancelEdit, handleKeyDown, setEditValue };
}
