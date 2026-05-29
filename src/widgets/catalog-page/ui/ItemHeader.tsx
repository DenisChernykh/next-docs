import type { CatalogItem } from "@/entities/catalog-item/model";

type ItemHeaderProps = {
  item: CatalogItem;
};

export function ItemHeader({ item }: ItemHeaderProps) {
  return (
    <header className="item-header">
      <div>
        <p className="item-header__kind">
          {item.kind === "block" ? "Block" : "Foundation"}
        </p>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
      <span className="status-pill">{item.status}</span>
    </header>
  );
}
