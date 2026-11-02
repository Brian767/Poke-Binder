import { useEffect, useState } from "react";
import { getCard } from "../api/pokemonTcgApi";
import CardItem from "../components/CardItem";
import { getTcgplayerMarketPrice } from "../components/CardItem";

const STORAGE_KEY = "poke-collection:cards:v1";
const LEGACY_STORAGE_KEY = "poke-binder:cards:v1";

function loadCollectionCards() {
  try {
    let storedCards = window.localStorage.getItem(STORAGE_KEY);
    const isMigrating = storedCards === null;
    if (isMigrating) {
      storedCards = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    const parsedCards = storedCards ? JSON.parse(storedCards) : [];

    if (!Array.isArray(parsedCards)) return [];

    if (isMigrating && storedCards !== null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedCards));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

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
  const [cards, setCards] = useState(loadCollectionCards);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      setCardDetails({});
      setIsLoadingPrices(false);
      return;
    }

    let isCurrent = true;
    setIsLoadingPrices(true);

    Promise.all(
      cards.map(async (card) => {
        try {
          return [card.id, await getCard(card.id)];
        } catch {
          return [card.id, null];
        }
      }),
    )
      .then((entries) => {
        if (isCurrent) setCardDetails(Object.fromEntries(entries));
      })
      .finally(() => {
        if (isCurrent) setIsLoadingPrices(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [cards]);

  function removeFromCollection(cardId) {
    const updatedCards = cards.filter((card) => card.id !== cardId);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
      setCards(updatedCards);
      setError(null);
    } catch {
      setError("Could not remove this card. Please try again.");
    }
  }

  const currentPrices = cards
    .map((card) => getTcgplayerMarketPrice(cardDetails[card.id]))
    .filter(Boolean);
  const totalValue = currentPrices.reduce((total, price) => total + price.amount, 0);
  const unpricedCardCount = cards.length - currentPrices.length;
  const formatUSD = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <section className="collection-page">
      <header className="collection-header">
        <h1>My Collection</h1>
        <p>Your saved Pokémon cards, all in one place.</p>
      </header>

      {error && <p className="collection-error" role="alert">{error}</p>}

      {cards.length === 0 ? (
        <p className="collection-empty">
          Your collection is empty. Add cards from the Cards page to see them here.
        </p>
      ) : (
        <>
          <p className="collection-count">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
          <section className="collection-value" aria-live="polite">
            <h2>Estimated collection value</h2>
            {isLoadingPrices ? (
              <p role="status">Loading current TCGplayer prices…</p>
            ) : (
              <>
                <p className="collection-total">{formatUSD(totalValue)}</p>
                {unpricedCardCount > 0 && (
                  <p>
                    TCGplayer prices unavailable for {unpricedCardCount} {unpricedCardCount === 1 ? "card" : "cards"},
                    those cards are excluded from the total.
                  </p>
                )}
              </>
            )}
          </section>
          <div className="card-grid">
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={{ ...card, ...(cardDetails[card.id] ?? {}) }}
                onRemoveFromCollection={removeFromCollection}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
