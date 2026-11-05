import { Link } from "react-router";

export default function Home() {
  return (
    <section className="home-page">
      <header className="home-header">
        <div className="home-welcome-copy">
          <p className="home-eyebrow">YOUR CARD COLLECTION, IN ONE PLACE</p>
          <h1>Welcome, Pokémon collector.</h1>
          <p className="home-intro">
            Find cards, keep track of what you own, and arrange your favorites in your binder.
          </p>
          <nav className="home-actions" aria-label="Get started">
            <Link className="home-button home-button-primary" to="/cards">
              Search cards <span aria-hidden="true">→</span>
            </Link>
            <Link className="home-button home-button-secondary" to="/collection">
              View collection
            </Link>
          </nav>
        </div>
        <div className="home-hero-aside" aria-hidden="true">
          <span className="home-hero-symbol">✦</span>
          <span className="home-hero-label">Collect your way</span>
        </div>
      </header>

      <section className="home-section" aria-labelledby="home-features-title">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">PICK UP WHERE YOU LIKE</p>
            <h2 id="home-features-title">Your collection journey</h2>
          </div>
        </div>
        <div className="home-features" aria-label="What you can do">
          <article className="home-feature">
            <span className="home-feature-number">01 / SEARCH</span>
            <h3>Discover cards</h3>
            <p>Explore Pokémon cards with set details, rarity, and available market prices.</p>
            <Link to="/cards">Search the catalog <span aria-hidden="true">→</span></Link>
          </article>
          <article className="home-feature">
            <span className="home-feature-number">02 / COLLECT</span>
            <h3>Track what you own</h3>
            <p>Keep a running collection with quantities and an estimated market total.</p>
            <Link to="/collection">Open collection <span aria-hidden="true">→</span></Link>
          </article>
          <article className="home-feature">
            <span className="home-feature-number">03 / ORGANIZE</span>
            <h3>Build your binder</h3>
            <p>Place your saved cards into pockets and arrange your binder pages.</p>
            <Link to="/binder">Open binder <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>
    </section>
  );
}
