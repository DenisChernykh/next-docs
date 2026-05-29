import { CatalogPage } from "@/widgets/catalog-page/ui/CatalogPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;

  return <CatalogPage kind="component" slug={slug} />;
}
