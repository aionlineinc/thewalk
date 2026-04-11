import type { Metadata } from "next";
import { BeliefsArticle } from "./BeliefsArticle";

export const metadata: Metadata = {
  title: "Beliefs (by Structure) | theWalk Ministries",
  description:
    "What we believe about the Father, the Son, the Holy Spirit, and the people of God—structure, unity, and servant leadership.",
};

export default function BeliefsPage() {
  return <BeliefsArticle />;
}
