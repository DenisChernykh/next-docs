import { redirect } from "next/navigation";

import { getDefaultCatalogItem } from "@/entities/catalog-item/model";

export default async function HomePage() {
  const item = await getDefaultCatalogItem();

  redirect(item?.href ?? "/blocks/video");
}
