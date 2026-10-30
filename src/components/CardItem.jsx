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
    const [, variant] = marketPrice;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(variant.marketPrice);
  }

  return "Price unavailable";
}

export default function CardItem({ card }) {
  return (
    <article className="card-item">
      <img src={`${card.image}/low.png`} alt={`${card.name} card`} />
      <h3>{card.name}</h3>
      <p className="card-set">{card.set?.name ?? "Unavailable"}</p>
      <div className="card-meta">
        <span>{card.rarity ?? "Unavailable"}</span>
        <span>#{card.localId ?? "—"}</span>
      </div>
      <p className="card-price">{getPriceLabel(card)}</p>
    </article>
  );
}
