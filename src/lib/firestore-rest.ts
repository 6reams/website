/**
 * Minimal, dependency-free Firestore reader used at BUILD TIME only.
 * Visitors never talk to Firebase; the static build bakes the data into HTML.
 *
 * Reads go through the public REST API and are governed by firestore.rules
 * (published posts + certifications are world-readable, everything else is admin-only).
 */

type FsValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { nullValue: null }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } };

export interface FsDoc {
  id: string;
  data: Record<string, unknown>;
}

const env = (key: string): string =>
  ((import.meta.env?.[key] as string | undefined) ?? process.env[key] ?? '').trim();

export function firebaseConfigured(): boolean {
  return Boolean(env('PUBLIC_FIREBASE_PROJECT_ID') && env('PUBLIC_FIREBASE_API_KEY'));
}

function decode(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return new Date(v.timestampValue);
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(decode);
  if ('mapValue' in v) {
    return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, decode(x)]));
  }
  return undefined;
}

/**
 * Run a query against a top-level collection.
 * `where` is an optional equality filter, e.g. { field: 'draft', value: false }.
 */
export async function queryCollection(
  collectionId: string,
  where?: { field: string; value: boolean | string },
): Promise<FsDoc[]> {
  const projectId = env('PUBLIC_FIREBASE_PROJECT_ID');
  const key = env('PUBLIC_FIREBASE_API_KEY');
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery?key=${encodeURIComponent(key)}`;

  const structuredQuery: Record<string, unknown> = { from: [{ collectionId }] };
  if (where) {
    structuredQuery.where = {
      fieldFilter: {
        field: { fieldPath: where.field },
        op: 'EQUAL',
        value: typeof where.value === 'boolean' ? { booleanValue: where.value } : { stringValue: where.value },
      },
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  });
  if (!res.ok) {
    throw new Error(`Firestore query on "${collectionId}" failed: ${res.status} ${await res.text()}`);
  }
  const rows = (await res.json()) as Array<{ document?: { name: string; fields?: Record<string, FsValue> } }>;
  return rows
    .filter((r) => r.document)
    .map((r) => ({
      id: r.document!.name.split('/').pop()!,
      data: decode({ mapValue: { fields: r.document!.fields } }) as Record<string, unknown>,
    }));
}
