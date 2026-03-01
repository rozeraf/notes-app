"use server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  if (!session) throw new Error("No session.");
  if (!session.user?.id) throw new Error("No user id.");
  return session.user.id;
};
export const createNote = async (title: string) => {
  const userId = await getAuthenticatedUserId();
  await db.insert(notes).values({
    userId,
    title,
  });
  revalidatePath("/notes");
};
export const deleteNote = async (id: string) => {
  const userId = await getAuthenticatedUserId();
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
  revalidatePath("/notes");
};
