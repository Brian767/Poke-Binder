import { getCards } from "../api/pokemonTcgApi";
import { useState } from "react";
import CardItem from "../components/CardItem";

export default function Cards() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      {isLoading && <p className="cards-status" role="status">Searching cards…</p>}
      {hasSearched && !isLoading && !error && cards.length === 0 && (
        <p className="cards-empty">No cards with images found. Try another Pokémon name.</p>
      )}
      {cards.length > 0 && (
        <div className="card-grid">
          {cards.map((card) => <CardItem key={card.id} card={card} />)}
        </div>
      )}
    </section>
  );
}
