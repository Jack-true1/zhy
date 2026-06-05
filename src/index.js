/**
 * Create a deterministic pseudo-random number generator.
 * Useful when you need reproducible draw results for testing or audit logs.
 */
export function createSeededRandom(seed = Date.now()) {
  let value = normalizeSeed(seed);
  return function random() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

export function validatePrizes(prizes) {
  if (!Array.isArray(prizes) || prizes.length === 0) {
    throw new TypeError("prizes must be a non-empty array");
  }

  return prizes.map((prize, index) => {
    if (!prize || typeof prize !== "object") {
      throw new TypeError(`prize at index ${index} must be an object`);
    }

    const id = String(prize.id ?? "").trim();
    const name = String(prize.name ?? "").trim();
    const weight = Number(prize.weight);
    const stock = Number(prize.stock);

    if (!id) throw new TypeError(`prize at index ${index} is missing id`);
    if (!name) throw new TypeError(`prize ${id} is missing name`);
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new TypeError(`prize ${id} weight must be greater than 0`);
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new TypeError(`prize ${id} stock must be a non-negative integer`);
    }

    return {
      ...prize,
      id,
      name,
      weight,
      stock
    };
  });
}

export function drawOne(prizes, options = {}) {
  const random = typeof options.random === "function" ? options.random : Math.random;
  const available = validatePrizes(prizes).filter((prize) => prize.stock > 0);

  if (available.length === 0) {
    return {
      prize: null,
      reason: "NO_STOCK"
    };
  }

  const totalWeight = available.reduce((sum, prize) => sum + prize.weight, 0);
  let cursor = random() * totalWeight;

  for (const prize of available) {
    cursor -= prize.weight;
    if (cursor <= 0) {
      return {
        prize,
        reason: "WIN"
      };
    }
  }

  return {
    prize: available.at(-1),
    reason: "WIN"
  };
}

export function drawBatch({ prizes, participants, seed, maxWinsPerUser = 1 }) {
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new TypeError("participants must be a non-empty array");
  }
  if (!Number.isInteger(maxWinsPerUser) || maxWinsPerUser < 1) {
    throw new TypeError("maxWinsPerUser must be a positive integer");
  }

  const random = createSeededRandom(seed);
  const stockMap = new Map(validatePrizes(prizes).map((prize) => [prize.id, { ...prize }]));
  const winCount = new Map();
  const records = [];

  for (const participant of participants) {
    const userId = String(participant.id ?? "").trim();
    if (!userId) continue;

    const userWins = winCount.get(userId) ?? 0;
    if (userWins >= maxWinsPerUser) {
      records.push({
        userId,
        prize: null,
        reason: "USER_LIMIT"
      });
      continue;
    }

    const currentPrizes = Array.from(stockMap.values());
    const result = drawOne(currentPrizes, { random });

    if (result.prize) {
      const storedPrize = stockMap.get(result.prize.id);
      storedPrize.stock -= 1;
      winCount.set(userId, userWins + 1);
    }

    records.push({
      userId,
      prize: result.prize ? pickPublicPrizeFields(result.prize) : null,
      reason: result.reason
    });
  }

  return {
    seed,
    records,
    remainingPrizes: Array.from(stockMap.values()).map(pickPublicPrizeFields)
  };
}

function normalizeSeed(seed) {
  const text = String(seed);
  let hash = 2166136261;

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function pickPublicPrizeFields(prize) {
  return {
    id: prize.id,
    name: prize.name,
    weight: prize.weight,
    stock: prize.stock
  };
}
