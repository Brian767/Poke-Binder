import { useState } from "react";
import CardItem from "../components/CardItem";

const STORAGE_KEY = "poke-binder:cards:v1";

function loadBinderCards() {
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

export default function Binders() {
  const [cards] = useState(loadBinderCards);

  return (
    <section className="binders-page">
      <header className="binders-header">
        <h1>My Binder</h1>
        <p>Your saved Pokémon cards, all in one place.</p>
      </header>

      {cards.length === 0 ? (
        <p className="binders-empty">
          Your binder is empty. Add cards from the Cards page to see them here.
        </p>
      ) : (
        <>
          <p className="binders-count">
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
