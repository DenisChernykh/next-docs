"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CatalogKind } from "@/entities/catalog-item/model";

export type CatalogNavItem = {
  kind: CatalogKind;
  slug: string;
  title: string;
  href: string;
};

type CatalogSidebarProps = {
  items: CatalogNavItem[];
};

const groups: Array<{ kind: CatalogKind; title: string }> = [
  { kind: "block", title: "Блоки" },
  { kind: "component", title: "Компоненты" },
];

export function CatalogSidebar({ items }: CatalogSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">A</span>
        <div>
          <strong>Aggregator</strong>
          <span>Component Library</span>
        </div>
      </div>

      <ScrollArea.Root className="sidebar__scroll">
        <ScrollArea.Viewport className="sidebar__viewport">
          {groups.map((group) => {
            const groupItems = items.filter((item) => item.kind === group.kind);

            return (
              <nav className="sidebar__group" key={group.kind} aria-label={group.title}>
                <h2>{group.title}</h2>
                <div className="sidebar__links">
                  {groupItems.map((item) => (
                    <Link
                      className="sidebar__link"
                      data-active={pathname === item.href}
                      href={item.href}
                      key={`${item.kind}:${item.slug}`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </nav>
            );
          })}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="sidebar__bar" orientation="vertical">
          <ScrollArea.Thumb className="sidebar__thumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </aside>
  );
}
