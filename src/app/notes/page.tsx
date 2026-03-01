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
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto flex flex-col gap-6 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
          <SignOutBtn />
        </div>
        <NoteForm />
        <ul className="flex flex-col gap-2">
          {notesList.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <span>{note.title}</span>
              <DeleteButton id={note.id} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
