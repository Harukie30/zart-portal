import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "visitor-count.json");

type VisitorStore = {
  count: number;
};

async function readStore(): Promise<VisitorStore> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<VisitorStore>;
    const count =
      typeof parsed.count === "number" && Number.isFinite(parsed.count)
        ? Math.max(0, Math.floor(parsed.count))
        : 0;
    return { count };
  } catch {
    return { count: 0 };
  }
}

async function writeStore(store: VisitorStore) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function getVisitorCount() {
  const store = await readStore();
  return store.count;
}

export async function incrementVisitorCount() {
  const store = await readStore();
  const next = store.count + 1;
  await writeStore({ count: next });
  return next;
}
