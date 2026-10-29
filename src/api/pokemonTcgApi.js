export default async function searchCards(name) {
  const params = new URLSearchParams({ name: name.trim() });
  const url = `https://api.tcgdex.net/v2/en/cards?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Card search failed (${response.status}). Please try again.`);
  }

  return response.json();
}
