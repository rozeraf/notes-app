"use client";

import { deleteNote } from "@/actions/notes";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        await deleteNote(id);
      }}
    >
      Delete
    </button>
  );
}
