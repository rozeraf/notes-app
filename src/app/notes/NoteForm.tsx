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
    >
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
