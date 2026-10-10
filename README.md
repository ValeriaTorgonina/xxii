# XXII

XXII is a tarot study app focused on the 22 major arcana.

The interface uses the supplied Antique Gold tarot design kit, local fonts and all 44 card illustrations. See the [integration guide](docs/design-kit-integration.md) and [verification results](docs/design-kit-qa.md).

## Features

- Scrollable catalog of all major arcana with a compact daily card.
- Dedicated card detail screen with previous/next navigation and return to the catalog.
- Search by card name, archetype, or keyword.
- Study groups: `0-VII`, `VIII-XIV`, and `XV-XXI`.
- Daily reflection card.
- Practice mode with upright and reversed meanings.

## Development

```bash
npm install
npm start
```

Run checks:

```bash
npm run lint
npx tsc --noEmit
```
