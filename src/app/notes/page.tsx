import { db } from "@/db";
import { notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import NoteForm from "./NoteForm";

export default async function NotesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = session.user?.id;
  if (!userId) redirect("/login");

  const notesList = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId));
  return (
    <main>
      <h1>Notes</h1>
      <ul>
        {notesList.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
      <NoteForm></NoteForm>
    </main>
  );
}
