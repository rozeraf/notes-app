"use client";
import { useState } from "react";
import { createNote } from "@/actions/notes";
export default function NoteForm() {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await createNote(title);
        setTitle("");
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="New note..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
