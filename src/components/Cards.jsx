import searchCards from "../api/pokemonTcgApi";
import { useState } from "react";

export default function Cards() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const cardData = await searchCards(inputValue);
      setCards(Array.isArray(cardData) ? cardData : []);

    } catch (error) {
      setCards([]);
      setError(error.message || "Something went wrong");
    }
  }

  const cardElements = cards.map((card) => {
    return (
      <div key={card.id}>
        {card.image && (
          <img src={`${card.image}/low.png`} alt={`${card.name} card`} />
        )}
        <h3>{card.name}</h3>
        <p>{card.id}</p>
      </div>
    );
  });

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search any pokemon"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p role="alert">{error}</p>}
      {cards.length > 0 && cardElements}
    </section>
  );
}
