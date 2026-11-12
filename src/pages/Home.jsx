import { useState } from "react";
import { Link } from "react-router";

const COLLECTION_KEY = "poke-collection:cards:v1";
const LEGACY_COLLECTION_KEY = "poke-binder:cards:v1";
const BINDER_KEY = "poke-collection:binder:v1";

function loadCollection() {
  try {
    const savedCards = localStorage.getItem(COLLECTION_KEY)
      ?? localStorage.getItem(LEGACY_COLLECTION_KEY);
    const cards = JSON.parse(savedCards || "[]");
    return Array.isArray(cards)
      ? cards.filter((card) => card?.id && card?.image)
      : [];
  } catch {
    return [];
  }
}

function loadBinderPageCount() {
  try {
    const pages = JSON.parse(localStorage.getItem(BINDER_KEY) || "[]");
    return Array.isArray(pages) && pages.length > 0 ? pages.length : 1;
  } catch {
    return 1;
  }
}

function getCardImageUrl(image) {
  const imageUrl = image.replace(/\/$/, "");
  return /\.(png|jpe?g|webp)(\?.*)?$/i.test(imageUrl)
    ? imageUrl
    : `${imageUrl}/low.png`;
}

export default function Home() {
  const [collection] = useState(loadCollection);
  const [binderPageCount] = useState(loadBinderPageCount);
  const totalCopies = collection.reduce(
    (total, card) => total + (Number.isInteger(card.quantity) && card.quantity > 0 ? card.quantity : 1),
    0,
  );
  const recentCards = [...collection].reverse().slice(0, 3);

  return (
    <section className="home-page">
      <header className="home-hero">
        <h1 className="home-hero-title">Welcome to PIKA BNDR</h1>
        <p className="home-hero-description">
          Search Pokémon cards, keep track of your collection, and organize
          your binder in one place.
        </p>
        <Link className="home-action" to="/cards">Explore cards</Link>
      </header>

      <section className="home-stats" aria-label="Collection overview">
        <div className="home-stat">
          <strong>{collection.length}</strong>
          <span>Unique cards</span>
        </div>
        <div className="home-stat">
          <strong>{totalCopies}</strong>
          <span>Total copies</span>
        </div>
        <div className="home-stat">
          <strong>{binderPageCount}</strong>
          <span>Binder pages</span>
        </div>
      </section>

      <section className="home-card-grid" aria-label="Explore PIKA BNDR">
        <Link className="home-feature-card" to="/cards">
          <h2>Discover cards</h2>
          <p>Search the card catalog and explore card details.</p>
          <span>Search cards →</span>
        </Link>

        <Link className="home-feature-card" to="/collection">
          <h2>My collection</h2>
          <p>Keep track of the cards and quantities you own.</p>
          <span>View collection →</span>
        </Link>

        <Link className="home-feature-card" to="/binder">
          <h2>My binder</h2>
          <p>Arrange your cards across binder pages.</p>
          <span>Open binder →</span>
        </Link>
      </section>

      <section className="home-recent" aria-labelledby="home-recent-title">
        <div className="home-recent-heading">
          <h2 id="home-recent-title">Recently added</h2>
          {recentCards.length > 0 && <Link to="/collection">View collection →</Link>}
        </div>
        {recentCards.length > 0 ? (
          <div className="home-recent-grid">
            {recentCards.map((card) => (
              <article className="home-recent-card" key={card.id}>
                <img src={getCardImageUrl(card.image)} alt={`${card.name} card`} />
                <div>
                  <h3>{card.name}</h3>
                  <p>{card.set?.name ?? card.set ?? "Pokémon card"}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-recent-empty">
            <p>Your collection is empty. Add your first card to see it here.</p>
            <Link to="/cards">Find a card</Link>
          </div>
        )}
      </section>
    </section>
  );
}
