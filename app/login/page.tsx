import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Owner login | NILU",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm p-6 pt-16">
      <h1 className="text-3xl font-bold text-brand">Owner login</h1>
      <p className="mt-2 text-ink/70">
        Sign in to see how your place is doing.
      </p>
      <LoginForm />
    </main>
  );
}
