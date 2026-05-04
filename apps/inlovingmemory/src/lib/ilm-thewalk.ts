/** Public marketing / registration site (myWalk). Used for “Create account” links from ILM. */
export function getThewalkPublicOrigin() {
  const raw = process.env.NEXT_PUBLIC_THEWALK_ORIGIN?.trim().replace(/\/$/, "");
  return raw || "https://thewalk.org";
}
