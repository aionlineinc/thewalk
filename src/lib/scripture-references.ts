/**
 * Detects common English Bible book references in prose. Longest names first so
 * "1 Corinthians" wins over "Corinthians" if both existed.
 * World English Bible text is fetched on hover via /api/scripture (public domain).
 */

const BOOKS_LONGEST_FIRST = [
  "Song of Solomon",
  "Song of Songs",
  "1 Corinthians",
  "2 Corinthians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Deuteronomy",
  "Lamentations",
  "Revelation",
  "Philippians",
  "Colossians",
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Joshua",
  "Judges",
  "Ruth",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Psalms",
  "Psalm",
  "Proverbs",
  "Ecclesiastes",
  "Isaiah",
  "Jeremiah",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "Galatians",
  "Ephesians",
  "Philemon",
  "Hebrews",
  "James",
  "Jude",
  "Job",
] as const;

function booksPattern(): string {
  return BOOKS_LONGEST_FIRST.map((b) => b.replace(/\s+/g, "\\s+")).join("|");
}

/**
 * Book + chapter:verse, optional same-chapter verse range.
 * Allows en/em dash or hyphen. Optional leading parenthesis.
 */
export function scriptureReferenceRegex(): RegExp {
  const books = booksPattern();
  return new RegExp(
    `(?:\\(|\\[)?(?<![A-Za-z0-9])(${books})\\s+(\\d{1,3}):(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?(?!\\s*:\\d)`,
    "gi",
  );
}

export type ScriptureToken =
  | { kind: "text"; value: string }
  | { kind: "ref"; value: string; display: string };

/** Strip trailing punctuation often glued to a reference in running copy. */
export function normalizeReferenceForApi(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("(")) s = s.slice(1);
  if (s.startsWith("[")) s = s.slice(1);
  s = s.replace(/[.,;:!?)\]]+$/g, "");
  return s.trim();
}

export function tokenizeScriptureText(text: string): ScriptureToken[] {
  const re = scriptureReferenceRegex();
  const tokens: ScriptureToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const copy = text;
  while ((m = re.exec(copy)) !== null) {
    const start = m.index;
    const rawEnd = m.index + m[0].length;
    if (start > last) {
      tokens.push({ kind: "text", value: copy.slice(last, start) });
    }
    const raw = copy.slice(start, rawEnd);
    const display = raw.replace(/^\(+/, "").replace(/\)+$/, "");
    const value = normalizeReferenceForApi(raw);
    if (value.length > 0) {
      tokens.push({ kind: "ref", value, display });
    } else {
      tokens.push({ kind: "text", value: raw });
    }
    last = rawEnd;
  }
  if (last < copy.length) {
    tokens.push({ kind: "text", value: copy.slice(last) });
  }
  return tokens;
}
