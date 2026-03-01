import { db } from "@/db";
import { notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import NoteForm from "./NoteForm";
import DeleteButton from "./DeleteButton";
import SignOutBtn from "./SignOutButton";

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
          <li key={note.id}>
            {note.title} <DeleteButton id={note.id} />
          </li>
        ))}
      </ul>
      <NoteForm></NoteForm>
      <SignOutBtn></SignOutBtn>
    </main>
  );
}
