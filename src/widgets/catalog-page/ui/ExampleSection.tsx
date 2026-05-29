import type { CatalogItem } from "@/entities/catalog-item/model";
import type { CodeTab } from "@/features/code-tabs/model/code-tabs";
import { CodeTabs } from "@/features/code-tabs/ui/CodeTabs";
import { PreviewFrame } from "@/features/preview-frame/ui/PreviewFrame";

type ExampleSectionProps = {
  item: CatalogItem;
  example: CatalogItem["examples"][number];
  tabs: CodeTab[];
  showHeading: boolean;
};

export function ExampleSection({
  item,
  example,
  tabs,
  showHeading,
}: ExampleSectionProps) {
  const variantSlug = example.slug === "default" ? undefined : example.slug;

  return (
    <section className="example-section">
      {showHeading && (
        <header className="example-section__header">
          <h2>{example.title}</h2>
          {example.description && <p>{example.description}</p>}
        </header>
      )}
      <CodeTabs
        tabs={tabs}
        preview={
          <PreviewFrame
            kind={item.kind}
            slug={item.slug}
            title={`${item.title} ${example.title}`}
            variantSlug={variantSlug}
          />
        }
      />
    </section>
  );
}
