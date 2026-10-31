import { getCards } from "../api/pokemonTcgApi";
import { useState } from "react";
import CardItem from "../components/CardItem";

const COLLECTION_STORAGE_KEY = "poke-binder:cards:v1";

function loadSavedCardIds() {
  try {
    const savedCards = JSON.parse(
      window.localStorage.getItem(COLLECTION_STORAGE_KEY) || "[]",
    );
    return Array.isArray(savedCards)
      ? savedCards.map((card) => card?.id).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export default function Cards() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [savedCardIds, setSavedCardIds] = useState(loadSavedCardIds);
  const [collectionError, setCollectionError] = useState(null);

  function addToCollection(card) {
    setCollectionError(null);

    try {
      const storedCards = JSON.parse(
        window.localStorage.getItem(COLLECTION_STORAGE_KEY) || "[]",
      );
      const collectionCards = Array.isArray(storedCards) ? storedCards : [];

      if (collectionCards.some((savedCard) => savedCard?.id === card.id)) {
        setSavedCardIds((ids) => (ids.includes(card.id) ? ids : [...ids, card.id]));
        return;
      }

      const savedCard = {
        id: card.id,
        image: card.image,
        name: card.name,
        set: card.set?.name ?? "Unknown set",
        rarity: card.rarity ?? "Unknown rarity",
        cardNumber: String(card.localId ?? ""),
      };
      const updatedCards = [...collectionCards, savedCard];

      window.localStorage.setItem(
        COLLECTION_STORAGE_KEY,
        JSON.stringify(updatedCards),
      );
      setSavedCardIds((ids) => [...ids, card.id]);
    } catch {
      setCollectionError("Could not save this card. Please try again.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setCards([]);

    if (!inputValue.trim()) {
      setError("Enter a Pokémon name to search.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const cardData = await getCards(inputValue);
      setCards(Array.isArray(cardData) ? cardData.filter((card) => card.image) : []);
    } catch (error) {
      setCards([]);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
      {isLoading && <p className="cards-status" role="status">Searching cards…</p>}
      {hasSearched && !isLoading && !error && cards.length === 0 && (
        <p className="cards-empty">No cards with images found. Try another Pokémon name.</p>
      )}
      {cards.length > 0 && (
        <div className="card-grid">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onAddToCollection={addToCollection}
              isSaved={savedCardIds.includes(card.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
