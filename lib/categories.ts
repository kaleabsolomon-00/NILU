export const CATEGORIES = [
  { value: "cafe", label: "Cafes" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
  { value: "bar", label: "Bars" },
  { value: "park", label: "Parks" },
  { value: "cinema", label: "Cinemas" },
  { value: "game_zone", label: "Game zones" },
  { value: "other", label: "Other" },
] as const;

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
