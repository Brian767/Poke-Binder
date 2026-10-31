import { useState } from "react";
import CardItem from "../components/CardItem";

const STORAGE_KEY = "poke-binder:cards:v1";

function loadCollectionCards() {
  try {
    const storedCards = window.localStorage.getItem(STORAGE_KEY);
    const parsedCards = storedCards ? JSON.parse(storedCards) : [];

    if (!Array.isArray(parsedCards)) return [];

    const uniqueCards = new Map();
    for (const card of parsedCards) {
      if (
        card &&
        typeof card.id === "string" &&
        card.id &&
        typeof card.image === "string" &&
        card.image &&
        !uniqueCards.has(card.id)
      ) {
        uniqueCards.set(card.id, card);
      }
    }

    return [...uniqueCards.values()];
  } catch {
    return [];
  }
}

export default function Collection() {
  const [cards] = useState(loadCollectionCards);

  return (
    <section className="collection-page">
      <header className="collection-header">
        <h1>My Collection</h1>
        <p>Your saved Pokémon cards, all in one place.</p>
      </header>

      {cards.length === 0 ? (
        <p className="collection-empty">
          Your collection is empty. Add cards from the Cards page to see them here.
        </p>
      ) : (
        <>
          <p className="collection-count">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
          <div className="card-grid">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} showPrice={false} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
