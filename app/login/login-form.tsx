"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { Button } from "@/components/button";

const initialState: LoginState = {};

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-soft bg-transparent p-3 focus:border-brand focus:outline-none";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="font-medium">
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
        <label htmlFor="password" className="font-medium">
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
        <p role="alert" className="font-medium text-red-700">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
