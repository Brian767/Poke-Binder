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
