import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Войти через Google</button>
    </form>
  );
}
