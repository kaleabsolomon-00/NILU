"use client";

import { useActionState, useState } from "react";
import { updateDetails, type DetailsState } from "./actions";
import { Button } from "@/components/button";

type Initial = {
  description: string;
  address: string;
  area: string;
  openingHours: string;
};

const initialState: DetailsState = { status: "idle" };
const fieldClass =
  "mt-1 w-full rounded-xl border-2 border-soft bg-transparent p-3 focus:border-brand focus:outline-none";

export default function DetailsForm({
  venueId,
  initial,
}: {
  venueId: string;
  initial: Initial;
}) {
  const [state, formAction, pending] = useActionState(
    updateDetails,
    initialState,
  );
  const [values, setValues] = useState(initial);

  const set =
    (key: keyof Initial) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  return (
    <form action={formAction} className="mt-4 space-y-5">
      <input type="hidden" name="venueId" value={venueId} />

      <div>
        <label htmlFor="description" className="font-medium">
          About your place
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          value={values.description}
          onChange={set("description")}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="area" className="font-medium">
          Area or neighborhood
        </label>
        <input
          id="area"
          name="area"
          maxLength={100}
          value={values.area}
          onChange={set("area")}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="address" className="font-medium">
          Address
        </label>
        <input
          id="address"
          name="address"
          maxLength={200}
          value={values.address}
          onChange={set("address")}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="openingHours" className="font-medium">
          Opening hours
        </label>
        <textarea
          id="openingHours"
          name="openingHours"
          rows={3}
          maxLength={300}
          placeholder="Mon-Sat 7:00-22:00, Sun 9:00-20:00"
          value={values.openingHours}
          onChange={set("openingHours")}
          className={fieldClass}
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="font-medium text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "saved" && (
        <p role="status" className="font-medium text-brand">
          Saved.
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
