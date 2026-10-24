"use client";

import { useEffect, useState } from "react";

export function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(
      new Date(iso).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    );
  }, [iso]);

  return <span>{text ? `Today at ${text}` : ""}</span>;
}
