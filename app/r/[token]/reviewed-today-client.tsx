"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getLocalTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    emptySubscribe,
    () => getLocalTime(iso),
    () => "",
  );

  return <span>{text ? `Today at ${text}` : ""}</span>;
}
