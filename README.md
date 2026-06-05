# Lucky Draw Kit

A lightweight, dependency-free lucky draw engine for Web apps, mini apps, and Node.js services.

The project aims to give small and mid-sized teams a reproducible, auditable, and easy-to-extend foundation for lucky draw campaigns. It helps reduce the fairness, inventory, and record-keeping issues that often appear when every campaign rewrites its own draw logic.

It helps you implement:

- Weighted random draws
- Prize inventory control
- Per-user win limits
- Reproducible seeded randomness
- Draw records that can be persisted
- Audit snapshots for draw results
- TypeScript type declarations

> This project only provides the core draw logic. Before using it in production, handle campaign rule disclosure, prize fulfillment, user privacy, anti-abuse controls, and compliance review according to your business and jurisdiction.

## Installation

```bash
npm install lucky-draw-kit
```

For local development, clone the repository and run:

```bash
npm test
```

## Quick Start

```js
import { createAuditSnapshot, drawBatch } from "lucky-draw-kit";

const result = drawBatch({
  seed: "2026-summer-event",
  prizes: [
    { id: "phone", name: "Phone", weight: 1, stock: 1 },
    { id: "coupon", name: "Coupon", weight: 99, stock: 100 }
  ],
  participants: [
    { id: "user_001" },
    { id: "user_002" },
    { id: "user_003" }
  ],
  maxWinsPerUser: 1
});

console.log(result.records);

const audit = createAuditSnapshot(result, {
  eventId: "summer_2026",
  operator: "official"
});

console.log(audit.fingerprint);
```

## API

### `drawOne(prizes, options)`

Draws one prize from the prize list. Prizes with `0` stock are never selected.

### `drawBatch(options)`

Runs a batch draw for a participant list and returns draw records plus remaining inventory.

Parameters:

- `prizes`: Prize list
- `participants`: Participant list
- `seed`: Random seed for reproducible results
- `maxWinsPerUser`: Maximum wins per user, defaults to `1`

### `createSeededRandom(seed)`

Creates a reproducible pseudo-random function for testing and audit workflows.

### `createAuditSnapshot(drawResult, metadata)`

Creates an audit snapshot from a batch draw result, including record count, remaining inventory, and a stable fingerprint. Useful for database storage, exports, or campaign archives.

### `createFingerprint(value)`

Creates a stable fingerprint for any JSON-compatible value. The fingerprint is useful for quickly checking whether configuration or results changed. It is not a cryptographic signature.

### `stableStringify(value)`

Serializes JSON-compatible data with sorted object keys for audit and testing.

### `validatePrizes(prizes)`

Validates and normalizes prize configuration.

## Prize Format

```js
{
  id: "coupon",
  name: "Coupon",
  weight: 100,
  stock: 50
}
```

## Use Cases

- E-commerce lucky draw campaigns
- Mini app lucky draws
- Member benefit campaigns
- Internal event raffles
- Marketing campaign prototypes

## Project Documentation

- [Compliance and fairness checklist](./docs/compliance-checklist.md)
- [Project impact](./docs/project-impact.md)
- [Roadmap](./ROADMAP.md)
- [Contributing guide](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)

## License

MIT
