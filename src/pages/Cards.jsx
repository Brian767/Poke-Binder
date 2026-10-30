import { getCards } from "../api/pokemonTcgApi";
import { useState } from "react";

function getPriceLabel(card) {
  const tcgplayer = card.pricing?.tcgplayer;
  const tcgplayerVariants = [
    ["normal", tcgplayer?.normal],
    ["holofoil", tcgplayer?.holofoil],
    ["reverse holofoil", tcgplayer?.["reverse-holofoil"]],
    ["holo", tcgplayer?.holo],
    ["reverse", tcgplayer?.reverse],
  ];
  const marketPrice = tcgplayerVariants.find(
    ([, variant]) => typeof variant?.marketPrice === "number",
  );

  if (marketPrice) {
    const [variantName, variant] = marketPrice;
    return `${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(variant.marketPrice)}`;
  }
  return "Price unavailable";
}

export default function Cards() {
  const [inputValue, setInputValue] = useState("");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const cardData = await getCards(inputValue);
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
        <p>{card.set?.name ?? "Unavailable"}</p>
        <p>{card.rarity ?? "Unavailable"}</p>
        <p>{card.localId ?? "Unavailable"}</p>
        <p>{getPriceLabel(card)}</p>
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
      {cards.length > 0 && <div className="card-grid">{cardElements}</div>}
    </section>
  );
}
