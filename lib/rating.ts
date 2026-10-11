export const RATING_LABELS = [
  "Terrible",
  "Poor",
  "Okay",
  "Good",
  "Excellent",
] as const;

export type TagSentiment = "positive" | "negative";

// 4-5 stars: ask what was good. 1-3 stars: ask what could be improved.
export function tagSentimentForRating(rating: number): TagSentiment {
  return rating >= 4 ? "positive" : "negative";
}
