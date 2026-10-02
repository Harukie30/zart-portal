import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "visitor-count.json");
const redisKey = "visitor-count";

type VisitorStore = {
  count: number;
};

function redisConfig() {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  )?.replace(/\/$/, "");
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

function asCount(value: unknown) {
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, Math.floor(count));
}

async function redisCommand(command: "get" | "incr") {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/${command}/${redisKey}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Visitor store failed (${response.status})`);
  }

  const data = (await response.json()) as { result?: number | string | null };
  return asCount(data.result);
}

async function readStore(): Promise<VisitorStore> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<VisitorStore>;
    return { count: asCount(parsed.count) };
  } catch {
    return { count: 0 };
  }
}

async function writeStore(store: VisitorStore) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

let writeChain: Promise<number> = Promise.resolve(0);

async function incrementFileCount() {
  const result = writeChain.then(async () => {
    const store = await readStore();
    const next = store.count + 1;
    await writeStore({ count: next });
    return next;
  });

  writeChain = result.catch(() => getVisitorCount());
  return result;
}

export async function getVisitorCount() {
  const stored = await redisCommand("get");
  if (stored !== null) return stored;
  return (await readStore()).count;
}

export async function incrementVisitorCount() {
  if (redisConfig()) {
    const stored = await redisCommand("incr");
    return stored ?? 0;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Visitor count needs an Upstash Redis database connected to this Vercel project.",
    );
  }

  return incrementFileCount();
}
