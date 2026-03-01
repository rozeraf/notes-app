import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Notes App</h1>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Войти через Google
          </button>
        </form>
      </div>
    </main>
  );
}
