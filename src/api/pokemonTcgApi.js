// pokemonTcgApi.js

const API_BASE = "https://api.tcgdex.net/v2/en";

async function fetchJson(url, message) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${message} (${response.status}). Please try again.`);
  }

  return response.json();
}

export async function getCard(id) {
  return fetchJson(
    `${API_BASE}/cards/${encodeURIComponent(id)}`,
    "Failed to fetch card details",
  );
}

export async function getCards(name) {
  const params = new URLSearchParams({ name: name.trim() });
  const matches = await fetchJson(
    `${API_BASE}/cards?${params}`,
    "Card search failed",
  );

  return Promise.all(matches.map((card) => getCard(card.id)));
}

export async function getLatestSetCards() {
  const params = new URLSearchParams({
    "sort:field": "releaseDate",
    "sort:order": "DESC",
  });
  const sets = await fetchJson(
    `${API_BASE}/sets?${params}`,
    "Failed to load the latest set",
  );
  const latestSetBrief = sets.find((set) => (set.cardCount?.official ?? 0) > 0);

  if (!latestSetBrief) {
    throw new Error("No recent sets with cards were found.");
  }

  const set = await fetchJson(
    `${API_BASE}/sets/${encodeURIComponent(latestSetBrief.id)}`,
    "Failed to load the latest set",
  );
  const cardsWithImages = (set.cards ?? []).filter((card) => card.image);
  const cards = await Promise.all(cardsWithImages.map((card) => getCard(card.id)));

  return {
    setName: set.name,
    cards: cards.filter((card) => card.image),
  };
}
