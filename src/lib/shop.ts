import "server-only";

import { z } from "zod";

import { directusFetch } from "@/lib/directus";

const ShopProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  summary: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price_label: z.string().nullable().optional(),
  stripe_price_id: z.string(),
  image: z
    .object({
      id: z.string(),
    })
    .nullable()
    .optional(),
});

export type ShopProduct = z.infer<typeof ShopProductSchema>;

const ShopProductListResponseSchema = z.object({
  data: z.array(ShopProductSchema),
});

export async function listShopProducts(): Promise<ShopProduct[]> {
  let res: unknown;
  try {
    res = await directusFetch<unknown>(
      "/items/shop_products",
      {
        "filter[status][_eq]": "published",
        "filter[active][_eq]": true,
        sort: "sort",
        fields: [
          "id",
          "title",
          "summary",
          "category",
          "price_label",
          "stripe_price_id",
          "image.id",
        ].join(","),
        limit: -1,
      },
      { next: { revalidate: 120, tags: ["shop:products"] } },
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[shop] listShopProducts failed:", err);
    }
    return [];
  }

  const parsed = ShopProductListResponseSchema.safeParse(res);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[shop] invalid shop_products payload:",
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      );
    }
    return [];
  }
  return parsed.data.data;
}

