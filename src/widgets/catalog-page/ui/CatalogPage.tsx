import { notFound } from "next/navigation";

import type { CatalogKind } from "@/entities/catalog-item/model";
import {
  getCatalogItems,
  getCatalogItemWithVariant,
} from "@/entities/catalog-item/model";
import { getCodeTabs } from "@/features/code-tabs/model/code-tabs";
import { LibraryShell } from "@/widgets/library-shell/ui/LibraryShell";

import { ExampleSection } from "./ExampleSection";
import { ItemHeader } from "./ItemHeader";

type CatalogPageProps = {
  kind: CatalogKind;
  slug: string;
  variant?: string;
};

export async function CatalogPage({ kind, slug, variant }: CatalogPageProps) {
  const [items, item] = await Promise.all([
    getCatalogItems(),
    getCatalogItemWithVariant(kind, slug, variant),
  ]);

  if (!item) notFound();

  const exampleTabs = await Promise.all(
    item.examples.map(async (example) => ({
      example,
      tabs: await getCodeTabs(example),
    })),
  );

  return (
    <LibraryShell items={items}>
      <ItemHeader item={item} />
      <div className="examples-stack">
        {exampleTabs.map(({ example, tabs }) => (
          <ExampleSection
            example={example}
            item={item}
            key={example.slug}
            showHeading={item.examples.length > 1}
            tabs={tabs}
          />
        ))}
      </div>
    </LibraryShell>
  );
}
