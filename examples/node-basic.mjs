import { createAuditSnapshot, drawBatch } from "../src/index.js";

const result = drawBatch({
  seed: "demo-2026-06-05",
  prizes: [
    { id: "grand", name: "Grand Prize", weight: 1, stock: 1 },
    { id: "coupon", name: "Coupon", weight: 20, stock: 5 }
  ],
  participants: [
    { id: "user_001" },
    { id: "user_002" },
    { id: "user_003" },
    { id: "user_004" }
  ]
});

const audit = createAuditSnapshot(result, {
  eventId: "demo_event",
  operator: "example"
});

console.log(JSON.stringify({ result, audit }, null, 2));
