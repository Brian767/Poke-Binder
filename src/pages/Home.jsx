import { Link } from "react-router";

export default function Home() {
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
    </section>
  );
}
