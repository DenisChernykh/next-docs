"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <button className="icon-button" type="button" onClick={copyCode}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? "Скопировано" : "Скопировать"}</span>
    </button>
  );
}
