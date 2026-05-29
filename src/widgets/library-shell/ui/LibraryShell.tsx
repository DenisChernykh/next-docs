import type { ReactNode } from "react";

import type { CatalogItem } from "@/entities/catalog-item/model";
import { CatalogSidebar } from "@/features/catalog-navigation/ui/CatalogSidebar";

type LibraryShellProps = {
  items: CatalogItem[];
  children: ReactNode;
};

export function LibraryShell({ items, children }: LibraryShellProps) {
  const navItems = items.map((item) => ({
    kind: item.kind,
    slug: item.slug,
    title: item.title,
    href: item.href,
  }));

  return (
    <div className="library-shell">
      <CatalogSidebar items={navItems} />
      <main className="library-main">{children}</main>
    </div>
  );
}
