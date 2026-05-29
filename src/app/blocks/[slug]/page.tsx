import { CatalogPage } from "@/widgets/catalog-page/ui/CatalogPage";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export default async function BlockPage({ params, searchParams }: PageProps) {
  const [{ slug }, { variant }] = await Promise.all([params, searchParams]);

  return <CatalogPage kind="block" slug={slug} variant={variant} />;
}
