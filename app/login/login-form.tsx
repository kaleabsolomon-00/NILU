"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { Button } from "@/components/button";

const initialState: LoginState = {};

const inputClass =
  "mt-2 w-full rounded-2xl border-2 border-soft/80 bg-white/40 px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:bg-white/70 focus:ring-4 focus:ring-brand/10";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-9 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-bold text-ink/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-bold text-ink/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-700/20 bg-red-700/5 px-4 py-3 font-medium text-red-700"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
