"use client";

import { deleteNote } from "@/actions/notes";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        await deleteNote(id);
      }}
      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
    >
      Delete
    </button>
  );
}
