# PIKA BNDR

PIKA BNDR is a Pokémon card collection app. Search cards, keep track of the
cards you own, and organize them into binder pages.

## Features

- **Card discovery:** Search cards by Pokémon name or browse cards from the
  latest set. Filter results by set, rarity, and whether price data is
  available.
- **Collection tracking:** Add cards to your collection, update quantities,
  and see an estimated total value when TCGplayer market prices are available.
- **Binder:** Arrange cards in nine-pocket pages. Add cards from your
  collection, move them between pockets, and add or delete pages.
- **Home overview:** See your unique card count, total copies, binder page
  count, and recently added cards.
- **Saved on your device:** Your collection and binder pages persist in this
  browser using local storage.

Card data and artwork are provided by [TCGdex](https://tcgdex.dev/). Price data
is shown when available from TCGplayer.

## Run locally

You need Node.js and npm installed.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Other commands

```sh
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Check the source files with ESLint
```

The app fetches card data from TCGdex, so an internet connection is needed for
search and card artwork. Local storage is specific to the current browser and
device; it does not sync between devices.
