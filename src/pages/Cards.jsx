import { getCards, getLatestSetCards } from "../api/pokemonTcgApi";
import { useCallback, useEffect, useRef, useState } from "react";
import CardItem from "../components/CardItem";

const COLLECTION_STORAGE_KEY = "poke-collection:cards:v1";
const LEGACY_STORAGE_KEY = "poke-binder:cards:v1";

function loadSavedQuantities() {
  try {
    let savedCards = window.localStorage.getItem(COLLECTION_STORAGE_KEY);
    const isMigrating = savedCards === null;
    if (savedCards === null) {
      savedCards = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    }

    const parsedCards = JSON.parse(savedCards || "[]");
    if (!Array.isArray(parsedCards)) return [];

    if (isMigrating && savedCards !== null) {
      window.localStorage.setItem(
        COLLECTION_STORAGE_KEY,
        JSON.stringify(parsedCards),
      );
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    return parsedCards.reduce((quantities, card) => {
      if (card?.id) {
        quantities[card.id] = Number.isInteger(card.quantity) && card.quantity > 0
          ? card.quantity
          : 1;
      }
      return quantities;
    }, {});
  } catch {
    return {};
  }
}

export default function Cards() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState([]);
  const [defaultSetName, setDefaultSetName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cardQuantities, setCardQuantities] = useState(loadSavedQuantities);
  const [collectionError, setCollectionError] = useState(null);
  const hasManualSearch = useRef(false);

  const searchCards = useCallback(async (name) => {
    hasManualSearch.current = true;
    setError(null);
    setCards([]);
    setDefaultSetName("");

    if (!name.trim()) {
      setError("Enter a Pokémon name to search.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const cardData = await getCards(name);
      setCards(Array.isArray(cardData) ? cardData.filter((card) => card.image) : []);
    } catch (searchError) {
      setCards([]);
      setError(searchError.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadLatestSet() {
      setIsLoading(true);
      try {
        const result = await getLatestSetCards();
        if (isCurrent && !hasManualSearch.current) {
          setCards(result.cards);
          setDefaultSetName(result.setName);
        }
      } catch (loadError) {
        if (isCurrent && !hasManualSearch.current) {
          setError(loadError.message || "Could not load the latest set.");
        }
      } finally {
        if (isCurrent && !hasManualSearch.current) setIsLoading(false);
      }
    }

    loadLatestSet();
    return () => {
      isCurrent = false;
    };
  }, []);

  function changeCardQuantity(card, amount) {
    setCollectionError(null);

    try {
      const storedCards = JSON.parse(
        window.localStorage.getItem(COLLECTION_STORAGE_KEY) || "[]",
      );
      const collectionCards = Array.isArray(storedCards) ? storedCards : [];

      const savedCard = {
        id: card.id,
        image: card.image,
        name: card.name,
        set: card.set?.name ?? "Unknown set",
        rarity: card.rarity ?? "Unknown rarity",
        cardNumber: String(card.localId ?? ""),
      };
      const existingIndex = collectionCards.findIndex((saved) => saved?.id === card.id);
      const existingQuantity = existingIndex >= 0
        ? (Number.isInteger(collectionCards[existingIndex].quantity)
          ? collectionCards[existingIndex].quantity
          : 1)
        : 0;
      const nextQuantity = Math.max(0, existingQuantity + amount);
      let updatedCards;

      if (nextQuantity === 0) {
        updatedCards = collectionCards.filter((saved) => saved?.id !== card.id);
      } else if (existingIndex >= 0) {
        updatedCards = collectionCards.map((saved, index) =>
          index === existingIndex ? { ...saved, quantity: nextQuantity } : saved,
        );
      } else {
        updatedCards = [...collectionCards, { ...savedCard, quantity: nextQuantity }];
      }

      window.localStorage.setItem(
        COLLECTION_STORAGE_KEY,
        JSON.stringify(updatedCards),
      );
      setCardQuantities((quantities) => ({ ...quantities, [card.id]: nextQuantity }));
    } catch {
      setCollectionError("Could not save this card. Please try again.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await searchCards(inputValue);
  }

  return (
    <section className="cards-page">
      <header className="cards-header">
        <h1>Pokémon Card Search</h1>
        <p>Find cards by Pokémon name and explore their set, rarity, number, and TCGplayer price.</p>
      </header>
      <form onSubmit={handleSubmit}>
        <input
          className="cards-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search any pokemon"
        />
        <button className="cards-search-button" type="submit" disabled={isLoading}>
          {isLoading ? "Searching…" : "Search cards"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {collectionError && <p role="alert">{collectionError}</p>}
      {isLoading && <p className="cards-status" role="status">{hasSearched ? "Searching cards…" : "Loading the latest set…"}</p>}
      {hasSearched && !isLoading && !error && cards.length === 0 && (
        <p className="cards-empty">No cards with images found. Try another Pokémon name.</p>
      )}
      {!hasSearched && !isLoading && !error && cards.length === 0 && (
        <p className="cards-empty">No cards with images were found in the latest set.</p>
      )}
      {cards.length > 0 && (
        <>
          <h2 className="cards-results-title">
            {hasSearched ? "Search results" : `Latest set: ${defaultSetName}`}
          </h2>
          <div className="card-grid">
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                quantity={cardQuantities[card.id] ?? 0}
                onQuantityChange={(amount) => changeCardQuantity(card, amount)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
