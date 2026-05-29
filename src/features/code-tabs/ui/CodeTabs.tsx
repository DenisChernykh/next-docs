"use client";

import * as Tabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

import type { CodeTab } from "../model/code-tabs";
import { CopyButton } from "@/features/copy-code/ui/CopyButton";

type CodeTabsProps = {
  tabs: CodeTab[];
  preview: ReactNode;
};

export function CodeTabs({ tabs, preview }: CodeTabsProps) {
  return (
    <Tabs.Root className="doc-tabs" defaultValue="preview">
      <Tabs.List className="doc-tabs__list" aria-label="Просмотр и код">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content className="doc-tabs__panel doc-tabs__panel--preview" value="preview">
        {preview}
      </Tabs.Content>

      {tabs.map((tab) => (
        <Tabs.Content className="doc-tabs__panel" key={tab.value} value={tab.value}>
          <div className="code-panel">
            <div className="code-panel__bar">
              <span>{tab.sourceLabel}</span>
              {!tab.isMissing && <CopyButton value={tab.copyValue} />}
            </div>
            <div
              className="code-panel__scroll"
              dangerouslySetInnerHTML={{ __html: tab.highlightedHtml }}
            />
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
