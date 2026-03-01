"use client";
import { signOut } from "next-auth/react";
export default function SignOutBtn() {
  return (
    <button
      onClick={() => {
        signOut();
      }}
      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
    >
      Sign Out
    </button>
  );
}
