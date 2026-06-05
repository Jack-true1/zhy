export interface Prize {
  id: string | number;
  name: string;
  weight: number;
  stock: number;
  [key: string]: unknown;
}

export interface Participant {
  id: string | number;
  [key: string]: unknown;
}

export interface DrawRecord {
  userId: string;
  prize: PublicPrize | null;
  reason: "WIN" | "NO_STOCK" | "USER_LIMIT";
}

export interface PublicPrize {
  id: string;
  name: string;
  weight: number;
  stock: number;
}

export interface DrawBatchOptions {
  prizes: Prize[];
  participants: Participant[];
  seed?: string | number;
  maxWinsPerUser?: number;
}

export interface DrawBatchResult {
  seed: string | number | undefined;
  records: DrawRecord[];
  remainingPrizes: PublicPrize[];
}

export interface AuditSnapshot extends DrawBatchResult {
  version: "lucky-draw-kit/audit-v1";
  generatedAt: string;
  eventId: string | null;
  operator: string | null;
  recordCount: number;
  fingerprint: string;
}

export function createSeededRandom(seed?: string | number): () => number;
export function validatePrizes(prizes: Prize[]): PublicPrize[];
export function drawOne(
  prizes: Prize[],
  options?: { random?: () => number }
): { prize: PublicPrize | null; reason: "WIN" | "NO_STOCK" };
export function drawBatch(options: DrawBatchOptions): DrawBatchResult;
export function createAuditSnapshot(
  drawResult: DrawBatchResult,
  metadata?: { generatedAt?: string; eventId?: string; operator?: string }
): AuditSnapshot;
export function createFingerprint(value: unknown): string;
export function stableStringify(value: unknown): string;
