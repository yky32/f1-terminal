export function formatFetchError(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return "Something went wrong while loading data.";
  return trimmed;
}
