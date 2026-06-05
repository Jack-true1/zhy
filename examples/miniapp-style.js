import { drawBatch } from "../src/index.js";

export function runMiniappLuckyDraw(activity) {
  return drawBatch({
    seed: activity.seed,
    prizes: activity.prizes,
    participants: activity.participants,
    maxWinsPerUser: 1
  });
}
