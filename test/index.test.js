import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSeededRandom, drawBatch, drawOne, validatePrizes } from "../src/index.js";

describe("lucky-draw-kit", () => {
  it("validates prize input", () => {
    assert.throws(() => validatePrizes([]), /non-empty/);
    assert.throws(() => validatePrizes([{ id: "a", name: "A", weight: 1, stock: -1 }]), /stock/);

    const prizes = validatePrizes([{ id: 1, name: "Coupon", weight: "2", stock: 3 }]);
    assert.equal(prizes[0].id, "1");
    assert.equal(prizes[0].weight, 2);
  });

  it("draws only prizes with stock", () => {
    const result = drawOne([
      { id: "empty", name: "Empty", weight: 1000, stock: 0 },
      { id: "gift", name: "Gift", weight: 1, stock: 1 }
    ]);

    assert.equal(result.reason, "WIN");
    assert.equal(result.prize.id, "gift");
  });

  it("returns no stock when everything is empty", () => {
    const result = drawOne([{ id: "gift", name: "Gift", weight: 1, stock: 0 }]);
    assert.equal(result.reason, "NO_STOCK");
    assert.equal(result.prize, null);
  });

  it("supports deterministic batch draws", () => {
    const input = {
      seed: "release-2026-06",
      prizes: [
        { id: "first", name: "First Prize", weight: 1, stock: 1 },
        { id: "coupon", name: "Coupon", weight: 9, stock: 3 }
      ],
      participants: [
        { id: "u1" },
        { id: "u2" },
        { id: "u3" },
        { id: "u4" }
      ]
    };

    const firstRun = drawBatch(input);
    const secondRun = drawBatch(input);

    assert.deepEqual(firstRun, secondRun);
    assert.equal(firstRun.records.length, 4);
  });

  it("creates seeded random values in [0, 1)", () => {
    const random = createSeededRandom("demo");
    for (let i = 0; i < 20; i += 1) {
      const value = random();
      assert.ok(value >= 0);
      assert.ok(value < 1);
    }
  });
});
