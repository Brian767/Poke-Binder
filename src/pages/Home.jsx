import { Link } from "react-router";

export default function Home() {
  return (
    <section className="home-page">
      <header className="home-header">
        <p className="home-eyebrow">PIKA BNDR</p>
        <h1>Welcome, Pokémon collector.</h1>
        <p className="home-intro">
          Search Pokémon cards, explore their details and prices, and keep your
          favorites together in your collection.
        </p>
        <nav className="home-actions" aria-label="Get started">
          <Link className="home-button home-button-primary" to="/cards">
            Search cards <span aria-hidden="true">→</span>
          </Link>
          <Link className="home-button home-button-secondary" to="/collection">
            View your collection
          </Link>
        </nav>
      </header>

      <section className="home-features" aria-label="What you can do">
        <article className="home-feature">
          <span className="home-feature-number">01</span>
          <h2>Find a card</h2>
          <p>Search the Pokémon card catalog by name and browse card details.</p>
          <Link to="/cards">Explore cards <span aria-hidden="true">→</span></Link>
        </article>
        <article className="home-feature">
          <span className="home-feature-number">02</span>
          <h2>Save your favorites</h2>
          <p>Add cards to your collection and keep them handy for later.</p>
          <Link to="/cards">Start collecting <span aria-hidden="true">→</span></Link>
        </article>
        <article className="home-feature">
          <span className="home-feature-number">03</span>
          <h2>Track market value</h2>
          <p>See available TCGplayer prices and your estimated collection total.</p>
          <Link to="/collection">View collection <span aria-hidden="true">→</span></Link>
        </article>
      </section>
    </section>
  );
}
