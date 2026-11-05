import { useState } from "react";
import { Link } from "react-router";

const STORAGE_KEY = "poke-collection:binder:v1";
const COLLECTION_KEY = "poke-collection:cards:v1";
const POCKETS_PER_PAGE = 9;
const EMPTY_PAGE = () => Array(POCKETS_PER_PAGE).fill(null);

function loadPages() {
  try {
    const savedPages = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(savedPages) || savedPages.length === 0) return [EMPTY_PAGE()];

    return savedPages.map((page) => Array.from(
      { length: POCKETS_PER_PAGE },
      (_, index) => page?.[index] ?? null,
    ));
  } catch {
    return [EMPTY_PAGE()];
  }
}

function loadCollection() {
  try {
    const cards = JSON.parse(localStorage.getItem(COLLECTION_KEY) || "[]");
    return Array.isArray(cards)
      ? cards.filter((card) => card?.id && card?.image)
      : [];
  } catch {
    return [];
  }
}

function getCardImageUrl(image) {
  if (!image) return "";
  const imageUrl = image.replace(/\/$/, "");
  return /\.(png|jpe?g|webp)(\?.*)?$/i.test(imageUrl)
    ? imageUrl
    : `${imageUrl}/low.png`;
}

export default function Binder() {
  const [pages, setPages] = useState(loadPages);
  const [collection] = useState(loadCollection);
  const [currentPage, setCurrentPage] = useState(0);
  const [storageError, setStorageError] = useState("");
  const [dragSource, setDragSource] = useState(null);
  const [selectedPocket, setSelectedPocket] = useState(null);

  function savePages(nextPages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPages));
      setPages(nextPages);
      setStorageError("");
      return true;
    } catch {
      setStorageError("Binder pages could not be saved on this device.");
      return false;
    }
  }

  function addPage() {
    const nextPages = [...pages, EMPTY_PAGE()];
    if (savePages(nextPages)) setCurrentPage(nextPages.length - 1);
  }

  function updatePocket(pageIndex, pocketIndex, card) {
    const nextPages = pages.map((page) => [...page]);
    nextPages[pageIndex][pocketIndex] = card;
    savePages(nextPages);
  }

  function copiesPlaced(cardId) {
    return pages.flat().filter((card) => card?.id === cardId).length;
  }

  function addCard(card) {
    const quantity = Number.isInteger(card.quantity) && card.quantity > 0 ? card.quantity : 1;
    if (copiesPlaced(card.id) >= quantity) return;
    const firstEmpty = pages[currentPage].findIndex((pocket) => !pocket);
    if (firstEmpty !== -1) updatePocket(currentPage, firstEmpty, card);
  }

  function handleDrop(event, targetPage, targetPocket) {
    event.preventDefault();
    if (!dragSource) return;

    const nextPages = pages.map((page) => [...page]);
    const destinationCard = nextPages[targetPage][targetPocket];

    if (dragSource.type === "pocket") {
      const sourceCard = nextPages[dragSource.page][dragSource.pocket];
      if (!sourceCard) return;
      nextPages[dragSource.page][dragSource.pocket] = destinationCard;
      nextPages[targetPage][targetPocket] = sourceCard;
    } else {
      const sourceCard = collection.find((card) => card.id === dragSource.cardId);
      if (!sourceCard) return;
      const quantity = Number.isInteger(sourceCard.quantity) && sourceCard.quantity > 0
        ? sourceCard.quantity
        : 1;
      const placedWithoutDestination = copiesPlaced(sourceCard.id)
        - (destinationCard?.id === sourceCard.id ? 1 : 0);
      if (placedWithoutDestination >= quantity) return;
      nextPages[targetPage][targetPocket] = sourceCard;
    }

    savePages(nextPages);
    setDragSource(null);
  }

  function handleDragStart(event, source) {
    setDragSource(source);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "binder-card");
  }

  function handlePocketClick(pageIndex, pocketIndex) {
    if (!selectedPocket) {
      if (pages[pageIndex][pocketIndex]) setSelectedPocket({ page: pageIndex, pocket: pocketIndex });
      return;
    }

    if (selectedPocket.page === pageIndex && selectedPocket.pocket === pocketIndex) {
      setSelectedPocket(null);
      return;
    }

    const nextPages = pages.map((page) => [...page]);
    const selectedCard = nextPages[selectedPocket.page][selectedPocket.pocket];
    nextPages[selectedPocket.page][selectedPocket.pocket] = nextPages[pageIndex][pocketIndex];
    nextPages[pageIndex][pocketIndex] = selectedCard;
    if (savePages(nextPages)) setSelectedPocket(null);
  }

  const trayCards = collection.filter((card) => copiesPlaced(card.id) < (
    Number.isInteger(card.quantity) && card.quantity > 0 ? card.quantity : 1
  ));

  return (
    <section className="binder-page">
      <header className="binder-header">
        <p className="binder-eyebrow">PIKA BNDR</p>
        <h1>My Binder</h1>
        <p>Organize your cards across binder pages. Each page has nine pockets.</p>
      </header>

      <section className="binder-card-tray" aria-labelledby="binder-tray-title">
        <div className="binder-tray-heading">
          <div>
            <h2 id="binder-tray-title">Your collection</h2>
            <p>Drag cards into a pocket, or use Add. Scroll to see more.</p>
          </div>
          <Link to="/collection">Manage collection</Link>
        </div>
        {trayCards.length ? (
          <div className="binder-tray-scroll">
            <div className="binder-tray-grid">
              {trayCards.map((card) => (
                <article
                  className="binder-tray-card"
                  key={card.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, { type: "collection", cardId: card.id })}
                  onDragEnd={() => setDragSource(null)}
                  aria-label={`Drag ${card.name} into a binder pocket`}
                >
                  <img src={getCardImageUrl(card.image)} alt={`${card.name} card`} />
                  <div className="binder-tray-card-info">
                    <span title={card.name}>{card.name}</span>
                    <button type="button" onClick={() => addCard(card)} disabled={!pages[currentPage].some((pocket) => !pocket)}>
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="binder-tray-empty">
            {collection.length
              ? "All available copies are already in your binder."
              : <>Your collection is empty. Add cards on the <Link to="/cards">card search</Link> page.</>}
          </p>
        )}
      </section>

      <div className="binder-toolbar">
        <div className="binder-page-navigation" aria-label="Binder page navigation">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 0}
            aria-label="Previous binder page"
          >
            Previous
          </button>
          <span aria-live="polite">Page {currentPage + 1} of {pages.length}</span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === pages.length - 1}
            aria-label="Next binder page"
          >
            Next
          </button>
        </div>
        <button className="binder-add-page" type="button" onClick={addPage}>
          + Add page
        </button>
      </div>

      {storageError && <p className="binder-storage-error" role="alert">{storageError}</p>}

      <div className="binder-grid" aria-label={`Binder page ${currentPage + 1}`}>
        {pages[currentPage].map((card, index) => (
          <div
            className={`binder-pocket${card ? " binder-pocket-filled" : ""}${selectedPocket?.page === currentPage && selectedPocket?.pocket === index ? " binder-pocket-selected" : ""}`}
            key={index}
            aria-label={`Pocket ${index + 1}${card ? `: ${card.name}` : ", empty"}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, currentPage, index)}
            draggable={Boolean(card)}
            onDragStart={(event) => card && handleDragStart(event, { type: "pocket", page: currentPage, pocket: index })}
            onDragEnd={() => setDragSource(null)}
            onClick={() => handlePocketClick(currentPage, index)}
          >
            {card ? <img src={getCardImageUrl(card.image)} alt={`${card.name} card`} /> : <span>{index + 1}</span>}
            {card && <button type="button" className="binder-pocket-remove" onClick={(event) => { event.stopPropagation(); updatePocket(currentPage, index, null); setSelectedPocket(null); }} aria-label={`Remove ${card.name} from binder`}>×</button>}
          </div>
        ))}
      </div>

      <p className="binder-hint">
        Drag cards between pockets to rearrange them. On touch screens, tap a filled pocket and then another pocket to move or swap. Your binder pages are saved on this device.
      </p>
    </section>
  );
}
