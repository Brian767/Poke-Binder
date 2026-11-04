export function getTcgplayerMarketPrice(card) {
  const tcgplayer = card?.pricing?.tcgplayer;
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
    return { amount: variant.marketPrice, variantName };
  }

  return null;
}

function getPriceLabel(card) {
  const price = getTcgplayerMarketPrice(card);
  if (!price) return "Price unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.amount);
}

export default function CardItem({
  card,
  showPrice = true,
  quantity = 0,
  onQuantityChange,
}) {
  return (
    <article className="card-item">
      <img src={`${card.image}/low.png`} alt={`${card.name} card`} />
      <h3>{card.name}</h3>
      <p className="card-set">{card.set?.name ?? card.set ?? "Unavailable"}</p>
      <div className="card-meta">
        <span>{card.rarity ?? "Unavailable"}</span>
        <span>#{card.localId ?? card.cardNumber ?? "—"}</span>
      </div>
      {showPrice && <p className="card-price">{getPriceLabel(card)}</p>}
      {onQuantityChange && (
        <div className="card-quantity" role="group" aria-label={`${card.name} quantity`}>
          <span>Qty:</span>
          <div className="card-quantity-controls">
            <button
              type="button"
              onClick={() => onQuantityChange(-1)}
              disabled={quantity === 0}
              aria-label={`Remove one ${card.name}`}
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              onClick={() => onQuantityChange(1)}
              aria-label={`Add one ${card.name}`}
            >
              +
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
